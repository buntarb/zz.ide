/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.TestWSClient' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.Server' );
goog.require( 'zz.ide.models.Tree' );

zz.ide.services.TestWSClient = function( url, opt_protocol ){

    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );
};


zz.ide.services.TestWSClient.prototype.openHandler_ = function( ){

    console.log( '-------------OPEN-------------------' );
};

zz.ide.services.TestWSClient.prototype.messageHandler_ = function( input ){

    console.log( '-------------Client messageHandler_-------------------' );

    var data = input;
    console.log( '----------data = ' + data );
    for( var p in data ){

        console.log( p );
    }


    console.log( '---------------data.messageData = ' + data.messageData );
    for( var p in data.messageData ){

        console.log( p );
    }
    console.log( 'data.messageData[0] = ' + data.messageData[0] );
    console.log( 'typeof data.messageData[0] = ' + (typeof data.messageData[0]) );
    for( var p in data.messageData[0] ){

        console.log( p + ': ' + typeof data.messageData[0][p] );
    }
    console.log( 'data.messageData[0][3] = ' + data.messageData[0][3] );


    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    console.log( '---------------dataset = ' + dataset );
    for( var p in dataset ){

        console.log( p );
    }

    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    console.log( '-------------datarow = ' + datarow );
    for( var p in datarow ){

        console.log( p );
    }

    console.log( '+++++++++++++++datarow.data = ' + datarow.data );
    console.log( '+++++++++++++++typeof datarow.data = ' + (typeof datarow.data) );
    var unParsed = goog.json.unsafeParse(datarow.data);
    console.log( '+++++++++++++++typeof goog.json.unsafeParse(datarow.data) = ' + (typeof unParsed) );
    for( var p in unParsed ){

        console.log( p + ': ' + (typeof unParsed[p]) );
    }
    console.log( '+++++++++++++++unParsed[0] = ' + (unParsed[0]) );
    for( var p in unParsed[0] ){

        console.log( p + ': ' + (typeof unParsed[0][p]) );
    }
    console.log( '+++++++++++++++goog.isFunction( zz.ide.models.Tree ) = ' + (goog.isFunction( zz.ide.models.Tree )) );
    console.log( '+++++++++++++++zz.ide.models.Tree == zz.ide.models.Tree : ' + (zz.ide.models.Tree == zz.ide.models.Tree) );
    console.log( '+++++++++++++++zz.ide.models.Tree === zz.ide.models.Tree : ' + (zz.ide.models.Tree === zz.ide.models.Tree) );
    console.log( '+++++++++++++++zz.models.Dataset == zz.ide.models.Tree : ' + (zz.models.Dataset == zz.ide.models.Tree) );
    console.log( '+++++++++++++++zz.models.Dataset === zz.ide.models.Tree : ' + (zz.models.Dataset === zz.ide.models.Tree) );


    var serverModel = new zz.ide.models.Server( null, goog.json.unsafeParse(datarow.data) );
    console.log( '---------------serverModel = ' + serverModel );
    for( var p in serverModel ){

        console.log( p );
    }

    var serverModelDatarow = /** @type {zz.net.models.MessageDatarow} */ ( serverModel.firstDatarow( ) );
    console.log( '-------------serverModelDatarow = ' + serverModelDatarow );
    for( var p in serverModelDatarow ){

        console.log( p + ': ' + serverModelDatarow[p] );
    }

    var childrenTree = serverModelDatarow.children;

    console.log( '------------childrenTree = ' + childrenTree );

    for( var p in childrenTree ){

        console.log( p );
    }

    var currentRow = childrenTree.nextDatarow();

    while ( currentRow ){

        console.log( currentRow.path );
        currentRow = childrenTree.nextDatarow();
    }

    console.log( '-------------END Client messageHandler_-------------------' );
}



zz.ide.services.TestWSClient.prototype.timeOut = function( ){

    setTimeout( function( ){

        console.log("---------------Start Timeout----------------");

        var serverModel = new zz.ide.models.Server();
        serverModel.createLast( ['myTitle', 'D', '/var/www/zz.ide', '', 0] );

        client.wsc_.sendCommandMessage( 'someCommand1', serverModel );

        console.log("---------------End Timeout----------------");



    }, 1000 );
}


var client = new zz.ide.services.TestWSClient( 'ws://localhost:7777' );

// client.wsc_.commands_ = ['someCommand1', 'someCommand2'];
// client.wsc_.addSupportedCommandInternal(  'someCommand1');
// client.wsc_.addSupportedCommandInternal(  'someCommand2');

client.timeOut();