
require( 'imazzine-developer-kit' );
goog.require( 'zz.net.WebSocketServer' );

goog.define( 'goog.DEBUG', false );

var server = new zz.net.WebSocketServer( {

    host: 'localhost',
    port: '7777',
    path: ''
} );
