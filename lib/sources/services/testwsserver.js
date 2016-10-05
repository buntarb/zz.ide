
require( 'imazzine-developer-kit' );
goog.require( 'zz.net.WebSocketServer' );

var server = new zz.net.WebSocketServer( {

    host: 'localhost',
    port: '7777',
    path: ''
} );

// server.timeOut = function( ){
//
//     setTimeout( function( ){
//
//         console.log("---------------Start Timeout On Server----------------");
//
//         // var serverModel = new zz.ide.models.Server();
//         // serverModel.createLast( ['myTitle', 'D'] );
//         // ftService.wsc_.path_ = 'ws://localhost:7777';
//         // ftService.wsc_.sendCommandMessage( 's', serverModel );
//
//         server.commands_ = { cmd: [{
//
//             send: function( input ){
//                 console.log('=====================Some Command Done==============================');
//                 console.log(input);
//                 console.log('=====================End Some Command Done==============================');
//             }
//
//         } ]};
//
//         console.log( server.commands_ );
//
//         console.log("---------------End Timeout On Server----------------");
//
//         // ftService.wsc_.sendGreetingMessage();
//
//     }, 1000 );
// }
//
// server.timeOut();
