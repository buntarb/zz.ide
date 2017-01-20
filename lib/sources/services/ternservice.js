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
    this.ternSrv_ = opt_ternServer? opt_ternServer: idk.ternserver.getTernServer( );

    /**
     * WebSocket client.
     * @type {zz.net.WebSocketClient}
     * @private
     */
    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    this.wsc_.addSupportedCommand( zz.ide.enums.Command.TERN_REQUEST );

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

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
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.TERN_REQUEST,
        this.requestTernHandler_,
        false,
        this
    );
};

/**
 * Service request to tern event handler.
 * @private
 */
zz.ide.services.TernService.prototype.requestTernHandler_ = function( input ){

    try{

        var data = input;
        var outDataset = undefined;
        var outDatarow = undefined;
        var type = undefined;

        var dataset = new zz.net.models.MessageDataset( null, data.messageData );
        var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

        var inputModel = new zz.ide.models.TernRequest( null, goog.json.unsafeParse( datarow.data ) );
        var inputDatarow = inputModel.firstDatarow( );

        var query = undefined;
        var files = undefined;
        var timeout = undefined;
        if( goog.isDefAndNotNull( inputDatarow.query ) ){

            query = goog.json.unsafeParse( inputDatarow.query );
            type = query[ 'type' ];

        } else if( goog.isDefAndNotNull( inputDatarow.files ) ){

            type = 'addFiles';
            files = goog.json.unsafeParse( inputDatarow.files );

        } else if( goog.isDefAndNotNull( inputDatarow.timeout ) ){

            type = 'timeout';
            timeout = inputDatarow.timeout;
        }

        var documentRequest = { };
        documentRequest[ 'query' ] = query;
        documentRequest[ 'files' ] = files;
        documentRequest[ 'timeout' ] = timeout;

        this.ternSrv_.request( documentRequest, function( err, resp ) {

            try {

                if ( err ) {

                    outDatarow = [
                        type,
                        '',
                        ( '' + err )
                    ];

                } else {

                    outDatarow = [
                        type,
                        goog.json.serialize( resp ),
                        ''
                    ];
                }

                outDataset = new zz.ide.models.TernResponse( );
                outDataset.createLast( outDatarow );
                outDatarow = outDataset.firstDatarow( );

                this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND,
                    datarow.command,
                    data.messageSource,
                    outDataset );

            }catch ( e ){

                console.log( 'Error in ternservice: ' + e );
            }

        }.bind( this ) );

    } catch( e ) {

        console.log( 'Error in ternservice: ' + e );
    }
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