/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/


var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.JSDocService' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.fs.FileTools' );

goog.require( 'zz.ide.models.JSDocQuery' );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/


/**
 * Service class for search documentation.
 * @param {string} url
 * @param {string} opt_protocol
 * @constructor
 */
zz.ide.services.JSDocService = function( url, opt_protocol ){

    /**
     * File tools.
     * @type {zz.fs.FileTools}
     * @private
     */
    this.ft_ = new zz.fs.FileTools( );

    /**
     * Map of keywords and their jsDoc definitions.
     * @type {Object}
     * @private
     */
    this.mapDoc_ = undefined;

    /**
     * Cash of keywords.
     * @type {Array}
     * @private
     */
    this.keys_ = undefined;

    /**
     * Whether service is valid.
     * @type {boolean}
     * @private
     */
    this.isValid_ = this.refreshJsDoc_( );

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
     * Map of commands {command: {binder, function}, ...}
     */
    var commandListenerMap = { };
    commandListenerMap[ zz.ide.enums.Command.JSDOC_QUERY ] = { binder: this.defaultBinder_, fun: this.query_ };
    commandListenerMap[ zz.ide.enums.Command.JSDOC_COMPLETE ]    = { binder: this.defaultBinder_, fun: this.complete_ };

    /**
     * Registering supported commands,
     * binding commands on their listeners
     */
    this.setUpCommands_( commandListenerMap );

    /**
     * Separate Listeners
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
 * Refresh search map doc json object and key words cash.
 * @return {boolean}
 * @private
 */
zz.ide.services.JSDocService.prototype.refreshJsDoc_ = function( ){

    this.mapDoc_ = undefined;
    this.keys_ = undefined;
    this.isValid_ = false;

    var d = this.ft_.getPathDelim();
    var path = this.ft_.getRootPath() + d + 'jsdoc' + d + 'searchMapDoc.json';

    try {

        this.mapDoc_ = JSON.parse( this.ft_.readFileSync( path, 'utf8' ) );
        this.keys_ = goog.object.getKeys( this.mapDoc_ ).sort( );

    } catch ( e ){ }

    this.isValid_ = goog.isDefAndNotNull( this.mapDoc_ ) && goog.isDefAndNotNull( this.keys_ );

    return this.isValid_;
}

/**
 * Service's jsdoc complete operation.
 * @private
 */
zz.ide.services.JSDocService.prototype.complete_ = function( datarow, opt_this ){

    var this_ = opt_this? opt_this: this;

    var result = [ ];
    var search = datarow.search;

    for( var i = 0; i < this_.keys_.length; i++ ){

        if( goog.string.contains( this_.keys_[ i ], search ) ){

            result.push( this_.keys_[ i ] );
        }
    }

    datarow.result = goog.json.serialize( result );
    datarow.stderr = '';
};

/**
 * Service's jsdoc query operation.
 * @private
 */
zz.ide.services.JSDocService.prototype.query_ = function( datarow, opt_this ){

    var this_ = opt_this? opt_this: this;

    datarow.result = goog.json.serialize( this_.mapDoc_[ datarow.search ] );
    datarow.stderr = '';
};


/**********************************************************************************************************************
 * Listeners                                                                                                          *
 **********************************************************************************************************************/


/**
 * Registering supported commands,
 * binding commands on their listeners
 * @param {Object} commandListenerMap
 * @private
 */
zz.ide.services.JSDocService.prototype.setUpCommands_ = function( commandListenerMap ){

    for( var command in commandListenerMap ){

        this.wsc_.addSupportedCommand( command );

        /**
         * Binding command handlers.
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
 * Bind specific service operation to use it as typical event handler
 * @param {Function} fun Operation
 * @return {Function} Event handler
 * @private
 */
zz.ide.services.JSDocService.prototype.defaultBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var data = input;
        var messageDataset = new zz.net.models.MessageDataset( null, data.messageData );
        var messageDatarow = /** @type {zz.net.models.MessageDatarow} */ ( messageDataset.firstDatarow( ) );
        var dataset = undefined;
        var datarow = undefined;
        var noError = true;

        try{

            dataset = new zz.ide.models.JSDocQuery( null, goog.json.unsafeParse( messageDatarow.data ) );
            datarow = dataset.firstDatarow( );

            if( this.isValid_ ){

                fun( datarow, this );

            } else {

                throw new Error( 'Service is invalid' );
            }

        } catch( e ) {

            if( datarow ){

                datarow.stderr = '' + e;

            } else if( dataset ) {

                try {

                    dataset.createLast( [ undefined, undefined, ( '' + e ) ] );

                } catch( e2 ) {

                    noError = false;
                    console.log ( 'Error: ' + e + '; ' + e2 );
                }

            } else {

                try {

                    dataset = new zz.ide.models.JSDocQuery( );
                    dataset.createLast( [ undefined, undefined, ( '' + e ) ] );

                } catch( e3 ) {

                    noError = false;
                    console.log ( 'Error: ' + e + '; ' + e3 );
                }
            }
        }

        if( noError ){
            try {

                this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND,
                    messageDatarow.command,
                    data.messageSource,
                    dataset );

            }catch ( e ){

                console.log( 'Error sending message: ' + e );
            }
        }
    };

    return handler;
};

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.JSDocService.prototype.openHandler_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.ide.services.JSDocService.prototype.readyHandler_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};


/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.ide.services.JSDocService', zz.ide.services.JSDocService );