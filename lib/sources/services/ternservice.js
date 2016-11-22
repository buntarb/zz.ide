/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.TernService' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.enums.Command' );

goog.require( 'zz.ide.models.TernRequest' );
goog.require( 'zz.ide.models.TernResponse' );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/

/**
 * Service class integrated with tern through web socket.
 * @param {string} url
 * @param {string} opt_protocol
 * @param {Object} opt_ternServer
 * @constructor
 */
zz.ide.services.TernService = function( url, opt_protocol, opt_ternServer ){

    /**
     * Tern server.
     * @type {Object}
     * @private
     */
    this.ternSrv_ = opt_ternServer? opt_ternServer: idk.ternServer.getTernServer( );

    /**
     * WebSocket client.
     * @type {zz.net.WebSocketClient}
     * @private
     */
    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

    /**
     * Map of commands on their handlers and configurations.
     * @type {Object}
     * @private
     */
    this.commandListenerMap_ = { };
    this.commandListenerMap_[ zz.ide.enums.Command.TERN_REQUEST ] = {
        binder: this.defaultBinder_,
        fun: this.defaultQueryTern_,
        inModelClass: zz.ide.models.TernRequest,
        outModelClass: zz.ide.models.TernResponse,
        inFieldsJSON: [ 'query', 'files' ],
        outFieldsJSON: [ '*' ]
    };
    // this.commandListenerMap_[ zz.ide.enums.Command.TERN_COMPLETIONS ] = {
    //     binder: this.defaultBinder_,
    //     fun: this.defaultQueryTern_,
    //     inModelClass: zz.ide.models.TernCompletions,
    //     outModelClass: zz.ide.models.TernCompletionsOut,
    //     queryType: 'completions',
    //     inDefaults: {
    //         filter: true,
    //         guess: true,
    //         sort: true,
    //         expandWordForward: true,
    //         omitObjectPrototype: true,
    //         inLiteral: true
    //     },
    //     inFieldsJSON: [ 'end', 'files' ],
    //     outFieldsJSON: [ 'completions' ]
    // };

    /**
     * Registering supported commands,
     * binding commands on their listeners
     */
    this.setUpCommands_( this.commandListenerMap_ );

    /**
     * This listeners cannot be registered by setUpCommands_
     */
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_READY,
        this.readyHandler_,
        false,
        this
    );
};

/**********************************************************************************************************************
 * Service operations                                                                                                 *
 **********************************************************************************************************************/

/**
 * Send request to tern server.
 * @param {Object} inDatarow Some datarow that presents input options
 * @param {Object} outDataset Some dataset that presents result
 * @param {Function} sendFun Interceptor function. We supposed that it sends message to WSServer but it may be anything.
 * @param {?string|undefined} opt_queryType Tern query type if it not presented as an input parameter in an inDatarow.
 * @param {?Array|undefined} opt_inFieldsJSON List of input fields that will be restore from JSON format.
 * @param {?Array|undefined} opt_outFieldsJSON List of output fields that will be transform to JSON format.
 * @param {?Object|undefined} opt_this Context
 * @private
 */
zz.ide.services.TernService.prototype.defaultQueryTern_ = function( inDatarow, outDataset, sendFun,
                                                                    opt_queryType, opt_inFieldsJSON, opt_outFieldsJSON,
                                                                    opt_this  ){

    var this_ = opt_this? opt_this: this;

    var query;
    var documentRequest = { };
    var restoreFromJSON = opt_inFieldsJSON? opt_inFieldsJSON: [ ];
    var convertToJSON = opt_outFieldsJSON? opt_outFieldsJSON: [ ];

    if( inDatarow.hasOwnProperty( 'files' ) ){

        if( goog.array.contains( restoreFromJSON, 'files' ) ){

            documentRequest.files = goog.json.unsafeParse( inDatarow.files );
        } else {

            documentRequest.files = inDatarow.files;
        }
    }
    if( inDatarow.hasOwnProperty( 'timeout' ) ){

        if( goog.array.contains( restoreFromJSON, 'timeout' ) ){

            documentRequest.timeout = goog.json.unsafeParse( inDatarow.timeout );
        } else {

            documentRequest.timeout = inDatarow.timeout;
        }
    }

    if( inDatarow.hasOwnProperty( 'query' ) ){ // Case when all options are presented in a query field as JSON

        if( goog.array.contains( restoreFromJSON, 'query' ) ){

            query = goog.json.unsafeParse( inDatarow.query );
        } else {

            query = inDatarow.query;
        }

    } else { // Case when options are presented in separate fields

        query = { };
        goog.removeUid( inDatarow );

        for( var field in inDatarow ){

            if( inDatarow.hasOwnProperty( field ) ){

                if( 'files' !== field && 'timeout' !== field ){

                    if( goog.array.contains( restoreFromJSON, field ) ){

                        query[ field ] = goog.json.unsafeParse( inDatarow[field] );
                    } else {

                        query[ field ] = inDatarow[field];
                    }
                }
            }
        }

        if( goog.isDefAndNotNull( opt_queryType ) ){

            query.type = opt_queryType;
        }
    }

    opt_queryType = query.type;

    documentRequest.query = query;

    this_.ternSrv_.request( documentRequest, function( err, resp ) {

        var datarowSchema = outDataset.getDatarowSchema( );
        var outDatarow = [ ];

        if ( err ) {

            // throw err;
            outDatarow[ datarowSchema.stderr.index ] = err;

        } else {

            if( goog.array.contains( convertToJSON, '*' ) ){ // Out datarow contains only two fields - stderr and response

                var payloadFieldIndex = -1;
                for( var p in datarowSchema ){

                    if( ( 'stderr' !== p ) && ( 'type' !== p ) ){

                        payloadFieldIndex = datarowSchema[ p ].index;
                        break;
                    }
                }

                if( payloadFieldIndex < 0 ){

                    // throw err;
                    outDatarow[ datarowSchema.stderr.index ] = 'Error: payload field (for response) not found';
                } else {

                    outDatarow[ payloadFieldIndex ] = goog.json.serialize( resp );
                    outDatarow[ datarowSchema.stderr.index ] = '';
                }

            } else { // Out datarow keeps fields separately

                for( var prop in resp ){

                    if( goog.array.contains( convertToJSON, prop ) ){

                        outDatarow[ datarowSchema[ prop ].index ] = goog.json.serialize( resp[ prop ] );
                    } else {

                        outDatarow[ datarowSchema[ prop ].index ] = resp[ prop ];
                    }
                }

                outDatarow[ datarowSchema.stderr.index ] = '';
            }
        }

        for( var pr in datarowSchema ){

            if( 'type' === pr ){

                outDatarow[ datarowSchema[ pr ].index ] = opt_queryType;
                break;
            }
        }

        outDataset.createLast( outDatarow );

        sendFun( this_ ); // Send to Server usually

    });
};


/**********************************************************************************************************************
 * Listeners                                                                                                          *
 **********************************************************************************************************************/

/**
 * Registering supported commands,
 * binding commands on their listeners
 * @param {Object} commandListenerMap A Map of commands on their configurations
 * @private
 */
zz.ide.services.TernService.prototype.setUpCommands_ = function( commandListenerMap ){

    for( var command in commandListenerMap ){

        this.wsc_.addSupportedCommand( command );

        /**
         * Binding commands to handlers.
         */
        this.eventHandler_.listenWithScope(
            this.wsc_,
            command,
            commandListenerMap[command].binder( commandListenerMap[command].fun ),
            false,
            this
        );
    }
};

/**
 * Bind specific service operation to use it as a typical event handler
 * @param {Function} fun One of the operations
 * @return {Function} Event handler function
 * @private
 */
zz.ide.services.TernService.prototype.defaultBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var outModel = undefined;
        var inputModel = undefined;
        var inputDatarow = undefined;
        var data = input;
        var datarow = undefined;

        try{

            var dataset = new zz.net.models.MessageDataset( null, data.messageData );
            datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

            var command = datarow.command;
            var commandConfig = this.commandListenerMap_[ command ];

            if( commandConfig ){

                inputModel = new commandConfig.inModelClass( null, goog.json.unsafeParse( datarow.data ) );
                inputDatarow = inputModel.firstDatarow( );

                var inDefaults = commandConfig.inDefaults;
                for( var prop in inDefaults){

                    if( !goog.isDefAndNotNull( inputDatarow[ prop ] ) ){

                        inputDatarow[ prop ] = inDefaults[ prop ];
                    }
                }

                outModel = new commandConfig.outModelClass( );

                fun( inputDatarow, outModel, function ( this_ ) {

                    this_ = this_? this_: this;

                    try {

                        this_.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND,
                            datarow.command,
                            data.messageSource,
                            outModel );

                    }catch ( e ){

                        console.log( 'Error sending message: ' + e );
                    }

                }, commandConfig.queryType, commandConfig.inFieldsJSON, commandConfig.outFieldsJSON, this );

            }else{

                throw new Error( 'Error: command ' + command + ' is not supported' );
            }

        }catch( e ){

            console.log( 'Error: ' + e );
        }
    };

    return handler;
};

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.TernService.prototype.openHandler_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.ide.services.TernService.prototype.readyHandler_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};


/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.ide.services.TernService', zz.ide.services.TernService );