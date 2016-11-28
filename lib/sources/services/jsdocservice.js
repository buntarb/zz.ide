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

    this.wsc_.addSupportedCommand( zz.ide.enums.Command.JSDOC_QUERY );

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

    /**
     * Listeners
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
        zz.ide.enums.Command.JSDOC_QUERY,
        this.jsdocQueryHandler_,
        false,
        this
    );
};

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
 * Service's jsdoc query event handler.
 * @private
 */
zz.ide.services.JSDocService.prototype.jsdocQueryHandler_ = function( input ){

    var data = input;
    var messageDataset = new zz.net.models.MessageDataset( null, data.messageData );
    var messageDatarow = /** @type {zz.net.models.MessageDatarow} */ ( messageDataset.firstDatarow( ) );
    var dataset = undefined;
    var datarow = undefined;
    var noError = true;

    try{

        dataset = new zz.ide.models.JSDocQuery( null, goog.json.unsafeParse( messageDatarow.data ) );
        datarow = dataset.firstDatarow( );
        var result = undefined;

        if( !this.isValid_ ){

            throw new Error( 'Service is invalid' );

        } else if( datarow.completed ){

            result = goog.json.serialize( this.mapDoc_[ datarow.search ] );

        } else {

            var search = datarow.search;
            result = [ ];
            for( var i = 0; i < this.keys_.length; i++ ){

                if( goog.string.contains( this.keys_[ i ], search ) ){

                    result.push( this.keys_[ i ] );
                }
            }

            result = goog.json.serialize( result );
        }

        datarow.result = result;
        datarow.stderr = '';

    } catch( e ) {

        if( datarow ){

            datarow.stderr = '' + e;

        } else if( dataset ) {

            try {

                dataset.createLast( [ undefined, undefined, undefined, ( '' + e ) ] );

            } catch( e2 ) {

                noError = false;
                console.log ( 'Error: ' + e + '; ' + e2 );
            }

        } else {

            try {

                dataset = new zz.ide.models.JSDocQuery( );
                dataset.createLast( [ undefined, undefined, undefined, ( '' + e ) ] );

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