/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.FtService' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.Server' );
goog.require( 'zz.ide.models.Tree' );

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

    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );
};

/**
 * Socket open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.openHandler_ = function( ){

    // if( goog.DEBUG ){

        console.log( '-------------OPEN-------------------' );

    console.log( this.wsc_.path_ );

    console.log( '-------------EndOPEN-------------------' );

    // this.wsc_.sendGreetingMessage();

    // for( var prop in this.wsc_){
    //
    //     console.log( prop );
    // }

    // console.log( '-------------EndOPEN-------------------' );

    // this.wsc_.send( new zz.net.models.GreetingDataset( ) );



    // }
    // this.dispatchEvent( new zz.net.events.WebSocketClientOpen( this ) );

    this.ft_ = idk.filetools;
};

/**
 * Socket message event handler.
 * @param {zz.net.events.WebSocketClientMessage} input
 * @private
 */
zz.ide.services.FtService.prototype.messageHandler_ = function( input ){

    console.log( '-------------FT messageHandler_-------------------' );

    // console.log( 'input = ' + input );

    var data = input;

    console.log('---------data.messageData = ' + data.messageData);

    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

    console.log('---------datarow = ' + datarow);

    for( var p in datarow ){

        console.log('p = ' + p);
    }

    console.log('---------datarow.data = ' + datarow.data );
    console.log('---------typeof datarow.data = ' + (typeof datarow.data) );

    var serverModel = new zz.ide.models.Server( null, goog.json.unsafeParse(datarow.data) );
    // var serverModel = new zz.ide.models.Server(  );
    // serverModel.createLast( datarow.data[0] );
    var serverModelDatarow = /** @type {zz.net.models.MessageDatarow} */ ( serverModel.firstDatarow( ) );

    console.log('---------serverModelDatarow = ' + serverModelDatarow );
    for( var pM in serverModelDatarow ){

        console.log( pM + ': ' + serverModelDatarow[pM] );
    }

    var file = serverModelDatarow.path;
    console.log('file = ' + file);

    var childrenFile = this.ft_.getDirectories( file );

    // console.log('children = ' + childrenFile);
    //
    // console.log( 'serverModelDatarow.children = ' + serverModelDatarow.children );

    // for( var c in serverModelDatarow.children ){
    //
    //     // console.log( c + ': ' + serverModelDatarow.children[c] );
    //     console.log( 'c = ' + c );
    // }

    var childrenTree = serverModelDatarow.children;

    for( var f in childrenFile ){

        childrenTree.createLast( ['someSubDir', 'D', childrenFile[f], '', 0 ] );
    }

    serverModelDatarow.count = childrenFile.length;

    console.log('serverModelDatarow = ' + serverModelDatarow);
    for( var pr in serverModelDatarow ){

        console.log( pr + ': ' + serverModelDatarow[pr] );
    }


    var firstChild = serverModelDatarow.children.firstDatarow();

    console.log('first child = ' + firstChild );
    for( var pr in firstChild ){

        console.log( pr + ': ' + firstChild[pr] );
    }

    console.log('---------messageSource = ' + data.messageSource);
    console.log('---------messageTarget = ' + data.messageTarget);
    console.log('---------socket = ' + data.socket);
    for( var pr in data.socket ){

        // console.log( pr + ': ' + data.socket[pr] );
        console.log( 'pr = ' + pr );
    }

    console.log('---------socket.commands_ = ' + data.socket.commands_);
    console.log('---------socket.resources_ = ' + data.socket.resources_);
    console.log('---------socket.path_ = ' + data.socket.path_);

    ftService.wsc_.sendCommandMessage( data.messageSource, serverModel );

    console.log( '-------------END FT messageHandler_-------------------' );
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

ftService.timeOut();

// ftService.wsc_.send( new zz.net.models.GreetingDataset( ) );

// ftService.wsc_.addSupportedCommandInternal( 's' );
// ftService.wsc_.sendGreetingMessage();


