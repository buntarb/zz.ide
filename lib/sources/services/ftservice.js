/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.FtService' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.Server' );
// goog.require( 'zz.ide.models.Tree' );

/**
 * Web socket client service class.
 * @param {string} url
 * @param {string} opt_protocol
 * @constructor
 */
zz.ide.services.FtService = function( url, opt_protocol ){

    // goog.base( this );

    /**
     * WebSocketClient event target element.
     * @type {zz.net.WebSocketClient}
     * @private
     */
    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );
    this.ft_ = idk.filetools;

    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );
};

/**
 * Socket open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.openHandler_ = function( ){

    // if( goog.DEBUG ){

    // this.wsc_.sendGreetingMessage();

    // for( var prop in this.wsc_){
    //
    //     console.log( prop );
    // }

    // console.log( '-------------EndOPEN-------------------' );

    // this.wsc_.send( new zz.net.models.GreetingDataset( ) );



    // }
    // this.dispatchEvent( new zz.net.events.WebSocketClientOpen( this ) );

    // this.ft_ = idk.filetools;
};

/**
 * Socket message event handler.
 * @param {zz.net.events.WebSocketClientMessage} input
 * @private
 */
zz.ide.services.FtService.prototype.messageHandler_ = function( input ){

    var data = input;

    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var serverModel = new zz.ide.models.Server( null, goog.json.unsafeParse(datarow.data) );
    var serverModelDatarow = /** @type {zz.net.models.MessageDatarow} */ ( serverModel.firstDatarow( ) );

    var file = serverModelDatarow.path;
    var childrenFile = this.ft_.getDirectories( file );

    var childrenTree = serverModelDatarow.children;
    for( var f in childrenFile ){

        childrenTree.createLast( ['someSubDir', 'D', childrenFile[f], '', 0 ] );
    }

    serverModelDatarow.count = childrenFile.length;

    ftService.wsc_.sendCommandMessage( data.messageSource, serverModel );
}



zz.ide.services.FtService.prototype.timeOut = function( ){

    setTimeout( function( ){

        console.log("---------------Start FT Timeout----------------");

        console.log("---------------End FT Timeout----------------");



    }, 1000 );
}


var ftService = new zz.ide.services.FtService( 'ws://localhost:7777' );

ftService.wsc_.addSupportedCommandInternal(  'someCommand1');
ftService.wsc_.addSupportedCommandInternal(  'someCommand2');

// ftService.timeOut();


