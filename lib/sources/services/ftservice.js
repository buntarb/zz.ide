/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.FtService' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );

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
    // this.ft_ = idk.filetools;

    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );
};

/**
 * Socket open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.openHandler_ = function( ){

    this.ft_ = idk.filetools;
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
    var model = new zz.ide.models.FilesTree( null, goog.json.unsafeParse(datarow.data) );
    var modelDatarow = /** @type {zz.net.models.MessageDatarow} */ ( model.firstDatarow( ) );

    var childrenTree = modelDatarow.children;

    var file = modelDatarow.path;
    var childrenFile = this.ft_.getDirectories( file );
    for( var f in childrenFile ){

        childrenTree.createLast([
            childrenFile[f].substring( childrenFile[f].lastIndexOf( this.ft_.CONST.PATH_DELIMITER ) + 1 ),
            zz.ide.enums.Const.FOLDER,
            childrenFile[f], '' ] );
    }
    childrenFile = this.ft_.getFiles( file );
    for( var f in childrenFile ){

        childrenTree.createLast([
            childrenFile[f].substring( childrenFile[f].lastIndexOf( this.ft_.CONST.PATH_DELIMITER ) + 1 ),
            zz.ide.enums.Const.FILE,
            childrenFile[f], '' ] );
    }

    modelDatarow.count = childrenFile.length;

    ftService.wsc_.sendCommandMessage( data.messageSource, model );
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


