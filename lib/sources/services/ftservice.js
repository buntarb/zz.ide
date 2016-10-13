/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.FtService' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );

goog.define( 'goog.DEBUG', false );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/

/**
 * Web socket client service class.
 * @param {string} url
 * @param {string} opt_protocol
 * @constructor
 */
zz.ide.services.FtService = function( url, opt_protocol ){

    /**
     * File tools.
     * @private
     */
    this.ft_ = idk.filetools;

    /**
     * Module root.
     * @type {string}
     * @const
     * @private
     */
    this.MODULE_ROOT_ = 'moduleRoot';

    /**
     * Regular expression for Module root replace.
     * @type {RegExp}
     * @const
     * @private
     */
    this.MODULE_ROOT_REG_EXP_ = new RegExp(
        this.ft_.getRootPath( ) +
        this.ft_.CONST.PATH_DELIMITER );

    /**
     * Regular expression for path delimeter replace.
     * @type {RegExp}
     * @const
     * @private
     */
    this.FILE_DELIM_REG_EXP_ = new RegExp( this.ft_.CONST.PATH_DELIMITER, 'g' );

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
     * Map {command: {binder, function}, ...}
     */
    var commandListenerMap = { };
    commandListenerMap[ zz.ide.enums.Command.GET_CHILDREN ] = { binder: this.generalBinder_, fun: this.getChildren_ };
    commandListenerMap[ zz.ide.enums.Command.OPEN_FILE ]    = { binder: this.generalBinder_, fun: this.openFile_ };
    commandListenerMap[ zz.ide.enums.Command.SAVE_FILE ]    = { binder: this.generalBinder_, fun: this.saveFile_ };

    /**
     * Registering supported commands,
     * binding commands on its listeners
     */
    this.setUpCommands_( commandListenerMap );

    /**
     * This listeners cannot be registered by setUpCommands_
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
 * Get files and directories as children from specified path in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ is a context
 * @private
 */
zz.ide.services.FtService.prototype.getChildren_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var childrenTree = treeDatarow.children;
    var path = this_.normalizePath_( treeDatarow.path );

    var children = this_.ft_.getDirectories( path );
    goog.array.forEach( children, function( path, index ){

        childrenTree.createLast([
            path.substring( path.lastIndexOf( this_.ft_.CONST.PATH_DELIMITER ) + 1 ),
            zz.ide.enums.Const.FOLDER,
            this_.denormalizePath_( path ),
            ''
        ] );

    }, this_ );

    children = this_.ft_.getFiles( path );
    goog.array.forEach( children, function( path, index ){

        childrenTree.createLast([
            path.substring( path.lastIndexOf( this_.ft_.CONST.PATH_DELIMITER ) + 1 ),
            zz.ide.enums.Const.FILE,
            this_.denormalizePath_( path ),
            ''
        ] );

    }, this_ );
};

/**
 * Get file content specified in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ is a context
 * @private
 */
zz.ide.services.FtService.prototype.openFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var path = this_.normalizePath_( treeDatarow.path );
    treeDatarow.content = this_.ft_.openFile( path );
};

/**
 * Save file content specified in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ is a context
 * @private
 */
zz.ide.services.FtService.prototype.saveFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var path = this_.normalizePath_( treeDatarow.path );
    this_.ft_.saveFile( path, treeDatarow.content );
    this_.openFile_( treeDatarow, this_ );
};

/**
 * Transforming passed pseudo path into a real absolute path independently of OS.
 * @param {string} path is pseudo or absolute path.
 * @return {string}
 * @private
 */
zz.ide.services.FtService.prototype.normalizePath_ = function( path ){

    if( goog.string.startsWith( path, this.MODULE_ROOT_ ) ){

        return this.ft_.normalizePath( path );

    } else {

        return this.ft_.normalizePath( this.MODULE_ROOT_ + '/' + path );
    }
};

/**
 * Transforming passed real absolute path into a pseudo path.
 * @param {string} path is pseudo or absolute path.
 * @return {string}
 * @private
 */
zz.ide.services.FtService.prototype.denormalizePath_ = function( path ){

    return path.replace( this.MODULE_ROOT_REG_EXP_, '' ).replace( this.FILE_DELIM_REG_EXP_, '/' );
};


/**********************************************************************************************************************
 * Listeners                                                                                                          *
 **********************************************************************************************************************/

/**
 * Registering supported commands,
 * binding commands on its listeners
 * @param {command:{binder:Function, fun:Function}} commandListenerMap is a Map
 * @private
 */
zz.ide.services.FtService.prototype.setUpCommands_ = function( commandListenerMap ){

    for( var command in commandListenerMap ){

        this.wsc_.addSupportedCommand( command );

        this.eventHandler_.listenWithScope(
            this.wsc_,
            command,
            commandListenerMap[command].binder( commandListenerMap[command].fun ),
            false,
            this
        );

        /**
         * Binding commands to handlers.
         */
        commandListenerMap[command].binder( commandListenerMap[command].fun );
    }
};

/**
 * Bind specific service operation to use it as typical event handler
 * @param {Function} fun is a file tools operation
 * @return {Function} is an event handler
 * @private
 */
zz.ide.services.FtService.prototype.generalBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var data = input;
        var dataset = new zz.net.models.MessageDataset( null, data.messageData );
        var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

        var filesTreeModel = new zz.ide.models.FilesTree( null,goog.json.unsafeParse( datarow.data ) );
        var filesTreeDatarow = /** @type {zz.ide.models.FilesTreeDatarow} */ ( filesTreeModel.firstDatarow( ) );

        try{

            fun( filesTreeDatarow, this );
            this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND, datarow.command, data.messageSource, filesTreeModel );

        }catch( e ){

            this.wsc_.sendErrorMessage( data.messageSource, zz.net.enums.MessageType.ERROR, '' + e );
        }
    };

    return handler;
};

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.openHandler_ = function( ){ };

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.readyHandler_ = function( ){

    console.log( 'Service is ready' );
};


/**********************************************************************************************************************
 * Main                                                                                                               *
 **********************************************************************************************************************/

var ftService = new zz.ide.services.FtService( 'ws://localhost:7777' );


