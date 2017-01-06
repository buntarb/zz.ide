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
 * @constructor
 */
zz.ide.services.WebServerRunner = function( url, opt_protocol ){

    /**
     * Web server.
     * @type {Object}
     * @private
     */
    this.webSrv_ = undefined;

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

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

    /**
     * Map commands on their listeners {command: {binder, function}, ...}
     */
    var commandListenerMap = { };
    commandListenerMap[ zz.ide.enums.Command.START_SERVER ] = {
        binder: this.defaultBinder_,
        fun: this.startServerHandler_
    };
    commandListenerMap[ zz.ide.enums.Command.STOP_SERVER ] = {
        binder: this.defaultBinder_,
        fun: this.stopServerHandler_
    };
    commandListenerMap[ zz.ide.enums.Command.IS_SERVER_RUNNING ] = {
        binder: this.defaultBinder_,
        fun: this.isServerRunning_
    };

    /**
     * Registering supported commands,
     * binding commands on their listeners
     */
    this.setUpCommands_( commandListenerMap );

    /**
     * Other Listeners
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
};


/**********************************************************************************************************************
 * Service operations                                                                                                 *
 **********************************************************************************************************************/

/**
 * Is web server running handler.
 * @param {zz.ide.models.WebServerRunnerDatarow} runnerDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.WebServerRunner.prototype.isServerRunning_ = function( runnerDatarow, this_ ){

    this_ = this_? this_: this;

    runnerDatarow.isrunning = this_.isRunning_;
    runnerDatarow.stderr = '';
}

/**
 * Stop web server inner method.
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.WebServerRunner.prototype.stopServer_ = function( this_ ){

    this_ = this_? this_: this;

    var count = this_.sockets_.length;

    for( var i = 0; i < count; i++ ){

        var socket = this_.sockets_[ i ];
        if( !socket.destroyed ){

            socket.destroy( );
        }
    }

    while( this_.sockets_.length > 0 && count > 0 ){

        if( socket.destroyed ){

            goog.array.removeAt( this_.sockets_, 0 );
        }
        count--;
    }

    this_.webSrv_.close();
    this_.isRunning_ = false;
}

/**
 * Stop web server handler.
 * @param {zz.ide.models.WebServerRunnerDatarow} runnerDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.WebServerRunner.prototype.stopServerHandler_ = function( runnerDatarow, this_ ){

    this_ = this_? this_: this;

    this_.stopServer_( );
    runnerDatarow.stderr = '';
    runnerDatarow.isrunning = this_.isRunning_;
}

/**
 * Start web server handler.
 * @param {zz.ide.models.WebServerRunnerDatarow} runnerDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.WebServerRunner.prototype.startServerHandler_ = function( runnerDatarow, this_ ){

    this_ = this_? this_: this;

    if( this_.isRunning_ ){

        this_.stopServer_( this_ );
    }

    var ft = idk.filetools;
    var srvCfg = ft.openYaml( ft.getRootPath( ) + ft.CONST.PATH_DELIMITER + 'config.yaml' );

    this_.webSrv_ = idk[ 'server' ][ 'getWebServer' ]( );
    this_.webSrv_ = this_.webSrv_.listen( srvCfg[ 'SERVER' ][ 'SERVER_PORT' ] );

    var sockets = this_.sockets_;
    this_.webSrv_.on( 'connection', function( socket ){

        sockets.push( socket );
    });

    this_.isRunning_ = true;

    runnerDatarow.stderr = '';
    runnerDatarow.isrunning = this_.isRunning_;
};


/**********************************************************************************************************************
 * Listeners                                                                                                          *
 **********************************************************************************************************************/

/**
 * Registering supported commands,
 * binding commands on their listeners
 * @param {Object} commandListenerMap
 * @private
 */
zz.ide.services.WebServerRunner.prototype.setUpCommands_ = function( commandListenerMap ){

    for( var command in commandListenerMap ){

        this.wsc_.addSupportedCommand( command );

        /**
         * Binding commands to handlers.
         */
        this.eventHandler_.listenWithScope(
            this.wsc_,
            command,
            commandListenerMap[command].binder( commandListenerMap[command].fun ),
            false,
            this
        );
    }
};

/**
 * Bind specific service operation to use it as typical event handler
 * @param {Function} fun Service operation
 * @return {Function} Event handler
 * @private
 */
zz.ide.services.WebServerRunner.prototype.defaultBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var runnerModel = undefined;
        var runnerDatarow = undefined;
        var data = input;
        var datarow = undefined;

        try{

            var dataset = new zz.net.models.MessageDataset( null, data.messageData );
            datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

            runnerModel = new zz.ide.models.WebServerRunner( null, goog.json.unsafeParse( datarow.data ) );
            runnerDatarow = /** @type {zz.ide.models.WebServerRunner} */ ( runnerModel.firstDatarow( ) );

            fun( runnerDatarow, this );

        }catch( e ){

            if( !runnerDatarow ){

                runnerModel = new zz.ide.models.WebServerRunner();
                runnerDatarow = runnerModel.createLast( [ ] );
            }

            runnerDatarow.stderr = '' + e;
        }

        try {

            this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND, datarow.command, data.messageSource, runnerModel );

        }catch ( e ){

            console.log( 'Error sending message: ' + e );
        }
    };

    return handler;
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