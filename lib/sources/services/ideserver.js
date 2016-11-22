
require( 'imazzine-developer-kit' );
goog.provide( 'zz.ide.services.IdeServer' );
goog.require( 'zz.net.WebSocketServer' );

/**
 * Web socket server class.
 * @param {string} host
 * @param {number} port
 * @param {string} path
 * @constructor
 */
zz.ide.services.IdeServer = function( host, port, path ){

    /**
     * WebSocket server.
     * @type {zz.net.WebSocketServer}
     * @private
     */
    this.wss_ = new zz.net.WebSocketServer( {

        host: host,
        port: port,
        path: path
    } );

};

goog.exportSymbol( 'zz.ide.services.IdeServer', zz.ide.services.IdeServer );

new zz.ide.services.IdeServer('localhost', 7777, '');