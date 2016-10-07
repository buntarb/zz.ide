/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.TestWSClient' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );

zz.ide.services.TestWSClient = function( url, opt_protocol ){

    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );
};


zz.ide.services.TestWSClient.prototype.openHandler_ = function( ){

    console.log( '-------------OPEN-------------------' );
};

zz.ide.services.TestWSClient.prototype.messageHandler_ = function( input ){

    var data = input;

    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var model = new zz.ide.models.FilesTree( null, goog.json.unsafeParse(datarow.data) );
    var modelDatarow = /** @type {zz.net.models.MessageDatarow} */ ( model.firstDatarow( ) );

    var childrenTree = modelDatarow.children;

    console.log( '========================RESPONSE========================' );

    var currentRow = childrenTree.nextDatarow();
    while ( currentRow ){

        console.log( currentRow.type + ':\t' + currentRow.name + ':\t\t' + currentRow.path );
        currentRow = childrenTree.nextDatarow();
    }

    console.log( '========================================================' );
}



zz.ide.services.TestWSClient.prototype.timeOut = function( ){

    setTimeout( function( ){

        console.log("---------------Start Request----------------");

        var model = new zz.ide.models.FilesTree();
        model.createLast( ['myTitle', zz.ide.enums.Const.FOLDER, '/var/www/zz.ide', ''] );

        client.wsc_.sendCommandMessage( 'someCommand1', model );

        console.log("---------------End Request----------------");

    }, 1000 );
}


var client = new zz.ide.services.TestWSClient( 'ws://localhost:7777' );
client.timeOut();