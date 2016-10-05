
require( 'imazzine-developer-kit' );
goog.require( 'zz.net.WebSocketServer' );

var server = new zz.net.WebSocketServer( {

    host: 'localhost',
    port: '7777',
    path: ''
} );
