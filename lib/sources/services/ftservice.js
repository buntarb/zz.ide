/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */


/**********************************************************************************************************************
 * Globals                                                                                                            *
 **********************************************************************************************************************/

require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.FtService' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );

goog.require( 'zz.fs.FileTools' );


/**********************************************************************************************************************
 * Constructor                                                                                                        *
 **********************************************************************************************************************/

/**
 * File tools service class.
 * @param {string} url
 * @param {string} opt_protocol
 * @constructor
 */
zz.ide.services.FtService = function( url, opt_protocol ){

    /**
     * File tools.
     * @type {zz.fs.FileTools}
     * @private
     */
    this.ft_ = new zz.fs.FileTools( );

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
    this.MODULE_ROOT_REG_EXP_ = new RegExp( goog.string.regExpEscape(
        this.ft_.getRootPath( ) +
        this.ft_.getPathDelim( ) ) );

    /**
     * Regular expression for path delimeter replace.
     * @type {RegExp}
     * @const
     * @private
     */
    this.FILE_DELIM_REG_EXP_ = new RegExp( goog.string.regExpEscape( this.ft_.getPathDelim( ) ), 'g' );

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
     * Map service command on idk command.
     * @type {Object}
     * @const
     * @private
     */
    this.idkCommandMap_ = { };

    this.idkCommandMap_[ zz.ide.enums.Command.IDK_HELP ]        = 'node idk help';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_APP ]     = 'node idk compile app ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_JS ]      = 'node idk compile js ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_SOY ]     = 'node idk compile soy ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_SCSS ]    = 'node idk compile scss ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_GSS ]     = 'node idk compile gss ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_CSS ]     = 'node idk compile css ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_DOC ]     = 'node idk compile doc ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_MODELS ]  = 'node idk compile models ';
    this.idkCommandMap_[ zz.ide.enums.Command.COMPILE_SVC ]     = 'node idk compile svc ';
    this.idkCommandMap_[ zz.ide.enums.Command.CALCDEPS ]        = 'node idk calcdeps ';
    this.idkCommandMap_[ zz.ide.enums.Command.EXTRACTMSG ]      = 'node idk extractmsg ';
    this.idkCommandMap_[ zz.ide.enums.Command.START_SERVER ]    = 'node idk start server ';
    this.idkCommandMap_[ zz.ide.enums.Command.UPDATE ]          = 'node idk update ';
    this.idkCommandMap_[ zz.ide.enums.Command.PUBLISH ]         = 'node idk publish ';

    /**
     * Map file tools commands {command: {binder, function}, ...}
     */
    var commandListenerMap = { };
    commandListenerMap[ zz.ide.enums.Command.GET_CHILDREN ] = { binder: this.defaultBinder_, fun: this.getChildren_ };
    commandListenerMap[ zz.ide.enums.Command.OPEN_FILE ]    = { binder: this.defaultBinder_, fun: this.openFile_ };
    commandListenerMap[ zz.ide.enums.Command.SAVE_FILE ]    = { binder: this.defaultBinder_, fun: this.saveFile_ };
    commandListenerMap[ zz.ide.enums.Command.REMOVE_FILE ]  = { binder: this.defaultBinder_, fun: this.removeFile_ };
    commandListenerMap[ zz.ide.enums.Command.COPY_FILE ]    = { binder: this.defaultBinder_, fun: this.copyFile_ };
    commandListenerMap[ zz.ide.enums.Command.RENAME_FILE ]  = { binder: this.defaultBinder_, fun: this.renameFile_ };
    commandListenerMap[ zz.ide.enums.Command.CREATE_FILE ]  = { binder: this.defaultBinder_, fun: this.saveFile_ };

    /**
     * Map idk commands
     */
    for( var idkCommand in this.idkCommandMap_ ){

        commandListenerMap[ idkCommand ]     = { binder: this.idkCommandBinder_, fun: this.executeHandler_ };
    }

    /**
     * Registering supported commands,
     * binding commands on their listeners
     */
    this.setUpCommands_( commandListenerMap );

    /**
     * Separate Listeners
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
 * Run shell command OS.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {string} command Shell command of OS
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.executeHandler_ = function( treeDatarow, command, this_ ){

    this_ = this_? this_: this;

    var executeResponse = this_.ft_.execSync( command );

    if( 1 === executeResponse.status  ){

        throw new Error( '' + executeResponse );
    }

    treeDatarow.stdout = '' + executeResponse;
    treeDatarow.stderr = '';
};

/**
 * Rename file.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.renameFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var pathFrom = this_.normalizePath_( treeDatarow.path );
    var pathTo = this_.normalizePath_( treeDatarow.path2 );

    this_.ft_.renameSync( pathFrom, pathTo );

    treeDatarow.stderr = '';
};

/**
 * Copy file.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.copyFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var pathFrom = this_.normalizePath_( treeDatarow.path );
    var pathTo = this_.normalizePath_( treeDatarow.path2 );

    this_.ft_.writeFileSync( pathTo, this_.ft_.readFileSync( pathFrom, 'utf8' ), 'utf8' );

    treeDatarow.stderr = '';
};

/**
 * Remove specified file in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.removeFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var path = this_.normalizePath_( treeDatarow.path );

    this_.ft_.unlinkSync( path );

    treeDatarow.stderr = '';
};

/**
 * Get files and directories as children from specified path in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.getChildren_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var childrenTree = treeDatarow.children;
    var path = this_.normalizePath_( treeDatarow.path );

    var children = this_.ft_.getDirectories( path );
    goog.array.forEach( children, function( path, index ){

        childrenTree.createLast([
            this_.denormalizePath_( path ),
            undefined,
            undefined,
            zz.ide.enums.Const.FOLDER
        ] );

    }, this_ );

    children = this_.ft_.getFiles( path );
    goog.array.forEach( children, function( path, index ){

        childrenTree.createLast([
            this_.denormalizePath_( path ),
            undefined,
            undefined,
            zz.ide.enums.Const.FILE
        ] );

    }, this_ );

    treeDatarow.stderr = '';
};

/**
 * Get file content specified in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.openFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var path = this_.normalizePath_( treeDatarow.path );

    treeDatarow.content = this_.ft_.readFileSync( path, 'utf8' );

    treeDatarow.stderr = '';
};

/**
 * Save file content specified in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @param {?Object|undefined} this_ Context
 * @private
 */
zz.ide.services.FtService.prototype.saveFile_ = function( treeDatarow, this_ ){

    this_ = this_? this_: this;

    var path = this_.normalizePath_( treeDatarow.path );

    this_.ft_.writeFileSync( path, treeDatarow.content, 'utf8' );

    treeDatarow.stderr = '';
};

/**
 * Transforming passed pseudo path into a real absolute path independently of OS.
 * @param {string} path Pseudo or absolute path.
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
 * @param {string} path Pseudo or absolute path.
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
 * binding commands on their listeners
 * @param {Object} commandListenerMap
 * @private
 */
zz.ide.services.FtService.prototype.setUpCommands_ = function( commandListenerMap ){

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
 * Bind service operation for idk command to use it as an event handler
 * @param {Function} fun File tools operation
 * @return {Function} Event handler
 * @private
 */
zz.ide.services.FtService.prototype.idkCommandBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var filesTreeModel = undefined;
        var filesTreeDatarow = undefined;
        var data = input;
        var datarow = undefined;

        try{

            var dataset = new zz.net.models.MessageDataset( null, data.messageData );
            datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

            var command = datarow.command;
            var idkCommand = this.idkCommandMap_[ command ];

            if( idkCommand ){

                if( datarow.params ){

                    idkCommand += datarow.params;
                }
                idkCommand = goog.string.trim( idkCommand );

                filesTreeModel = new zz.ide.models.FilesTree( null,goog.json.unsafeParse( datarow.data ) );
                filesTreeDatarow = /** @type {zz.ide.models.FilesTreeDatarow} */ ( filesTreeModel.firstDatarow( ) );

                fun( filesTreeDatarow, idkCommand, this );

            }else{

                throw new Error( 'idk command not found' );
            }

        }catch( e ){

            if( !filesTreeDatarow ){

                filesTreeModel = new zz.ide.models.FilesTree();
                filesTreeDatarow = filesTreeModel.createLast( [ ] );
            }

            filesTreeDatarow.stderr = '' + e;
        }

        try {

            this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND, datarow.command, data.messageSource, filesTreeModel );

        }catch ( e ){

            console.log( 'Error sending message: ' + e );
        }
    };

    return handler;
};

/**
 * Bind specific service operation to use it as typical event handler
 * @param {Function} fun File tools operation
 * @return {Function} Event handler
 * @private
 */
zz.ide.services.FtService.prototype.defaultBinder_ = function( fun ){

    /**
     * Service message event handler.
     * @param {zz.net.events.WebSocketClientMessage} input
     */
    var handler = function( input ){

        var filesTreeModel = undefined;
        var filesTreeDatarow = undefined;
        var data = input;
        var datarow = undefined;

        try{

            var dataset = new zz.net.models.MessageDataset( null, data.messageData );
            datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

            filesTreeModel = new zz.ide.models.FilesTree( null,goog.json.unsafeParse( datarow.data ) );
            filesTreeDatarow = /** @type {zz.ide.models.FilesTreeDatarow} */ ( filesTreeModel.firstDatarow( ) );

            fun( filesTreeDatarow, this );

        }catch( e ){

            if( !filesTreeDatarow ){

                filesTreeModel = new zz.ide.models.FilesTree();
                filesTreeDatarow = filesTreeModel.createLast( [ ] );
            }

            filesTreeDatarow.stderr = '' + e;
        }

        try {

            this.wsc_.sendMessage( zz.net.enums.MessageType.COMMAND, datarow.command, data.messageSource, filesTreeModel );

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
zz.ide.services.FtService.prototype.openHandler_ = function( ){ };

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.readyHandler_ = function( ){

    console.log( 'Service is ready as ' + this.wsc_.path_ );
};


/**********************************************************************************************************************
 * Exports                                                                                                            *
 **********************************************************************************************************************/

goog.exportSymbol( 'zz.ide.services.FtService', zz.ide.services.FtService );