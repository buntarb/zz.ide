/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.WebServerRunner' );

goog.require( 'goog.events.EventHandler' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.ide.models.WebServerRunner' );
goog.require( 'zz.ide.enums.Command' );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/

/**
 * Web server runner service class.
 * @param {string} url
 * @param {string} opt_protocol
 * @param {Object} opt_webServer
 * @constructor
 */
zz.ide.services.WebServerRunner = function( url, opt_protocol, opt_webServer ){

    /**
     * Web server.
     * @type {Object}
     * @private
     */
    this.webSrv_ = opt_webServer? opt_webServer: idk[ 'server' ][ 'getWebServer' ]( );

    /**
     * Flag if web server has to attach a connection listener
     * @type {boolean}
     * @private
     */
    this.needListenerConnection_ = true;

    /**
     * Connections pool
     * @type {Arraya}
     * @private
     */
    this.sockets_ = [ ];

    /**
     * Flag if web server is running
     * @type {boolean}
     * @private
     */
    this.isRunning_ = false;

    /**
     * WebSocket client.
     * @type {zz.net.WebSocketClient}
     * @private
     */
    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    this.wsc_.addSupportedCommand( zz.ide.enums.Command.START_SERVER );
    this.wsc_.addSupportedCommand( zz.ide.enums.Command.STOP_SERVER );

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

    /**
     * Listeners
     */
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_READY,
        this.readyHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.START_SERVER,
        this.startServerHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.STOP_SERVER,
        this.stopServerHandler_,
        false,
        this
    );
};

/**
 * Stop web server inner method.
 * @private
 */
zz.ide.services.WebServerRunner.prototype.stopServer_ = function( ){

    var count = this.sockets_.length;

    for( var i = 0; i < count; i++ ){

        var socket = this.sockets_[ i ];
        if( !socket.destroyed ){

            socket.destroy( );
        }
    }

    while( this.sockets_.length > 0 && count > 0 ){

        if( socket.destroyed ){

            goog.array.removeAt( this.sockets_, 0 );
        }
        count--;
    }

    this.webSrv_.close();
    this.isRunning_ = false;
}

/**
 * Stop web server handler.
 * @private
 */
zz.ide.services.WebServerRunner.prototype.stopServerHandler_ = function( input ){

    var runnerModel = undefined;
    var runnerDatarow = undefined;
    var data = input;
    var datarow = undefined;

    try{

        var dataset = new zz.net.models.MessageDataset( null, data.messageData );
        datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
        runnerModel = new zz.ide.models.WebServerRunner( null,goog.json.unsafeParse( datarow.data ) );
        runnerDatarow = /** @type {zz.ide.models.WebServerRunner} */ ( runnerModel.firstDatarow( ) );

        this.stopServer_( );

        runnerDatarow.stderr = '';
    }catch( e ){

        if( !runnerDatarow ){

            runnerModel = new zz.ide.models.WebServerRunner( );
            runnerDatarow = runnerModel.createLast( [ ] );
        }

        runnerDatarow.stderr = '' + e;
    }

    try {

        this.wsc_.sendMessage(
            zz.net.enums.MessageType.COMMAND,
            datarow.command,
            data.messageSource,
            runnerModel
        );

    }catch ( e ){

        console.log( 'Error sending message: ' + e );
    }
}

/**
 * Start web server handler.
 * @private
 */
zz.ide.services.WebServerRunner.prototype.startServerHandler_ = function( input ){

    var runnerModel = undefined;
    var runnerDatarow = undefined;
    var data = input;
    var datarow = undefined;

    try{

        var dataset = new zz.net.models.MessageDataset( null, data.messageData );
        datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
        runnerModel = new zz.ide.models.WebServerRunner( null,goog.json.unsafeParse( datarow.data ) );
        runnerDatarow = /** @type {zz.ide.models.WebServerRunner} */ ( runnerModel.firstDatarow( ) );

        if( this.isRunning_ ){

            this.stopServer_( );
        }

        var ft = idk.filetools;
        var srvCfg = ft.openYaml( ft.getRootPath( ) + ft.CONST.PATH_DELIMITER + 'config.yaml' );

        this.webSrv_ = idk[ 'server' ][ 'getWebServer' ]( );
        this.webSrv_ = this.webSrv_.listen( srvCfg[ 'SERVER' ][ 'SERVER_PORT' ] );
        this.needListenerConnection_ = true;

        if( this.needListenerConnection_ ){

            var sockets = this.sockets_;

            this.webSrv_.on( 'connection', function( socket ){

                sockets.push( socket );
            });

            this.needListenerConnection_ = false;
        }

        this.isRunning_ = true;

        runnerDatarow.stderr = '';

    }catch( e ){

        if( !runnerDatarow ){

            runnerModel = new zz.ide.models.WebServerRunner( );
            runnerDatarow = runnerModel.createLast( [ ] );
        }

        runnerDatarow.stderr = '' + e;
    }

    try {

        this.wsc_.sendMessage(
            zz.net.enums.MessageType.COMMAND,
            datarow.command,
            data.messageSource,
            runnerModel
        );

    }catch ( e ){

        console.log( 'Error sending message: ' + e );
    }
};

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.WebServerRunner.prototype.openHandler_ = function( ){ };

/**
 * Service ready event handler.
 * @private
 */
zz.ide.services.WebServerRunner.prototype.readyHandler_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};


/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.ide.services.WebServerRunner', zz.ide.services.WebServerRunner );