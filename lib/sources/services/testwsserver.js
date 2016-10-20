
require( 'imazzine-developer-kit' );
goog.require( 'zz.net.WebSocketServer' );

goog.define( 'goog.DEBUG', false );
goog.define( 'zz.net.PORT', 7777 );

var server = zz.net.WebSocketServer.getInstance( );
