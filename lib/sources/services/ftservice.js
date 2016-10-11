/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.FtService' );

goog.require( 'goog.events.EventHandler' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );

goog.define( 'goog.DEBUG', false );

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
        this.ft_.CONST.PATH_DELIMITER,
        'g' );

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

    this.wsc_.addSupportedCommand( zz.ide.enums.Command.GET_CHILDREN );
    this.wsc_.addSupportedCommand( zz.ide.enums.Command.OPEN_FILE );
    this.wsc_.addSupportedCommand( zz.ide.enums.Command.SAVE_FILE );

    /**
     * Service event handler.
     * @type {goog.events.EventHandler}
     * @private
     */
    this.eventHandler_ = new goog.events.EventHandler( );

    this.eventHandler_.listenWithScope(

        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(

        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_MESSAGE,
        this.messageHandler_,
        false,
        this
    )
};

/**
 * Service open event handler.
 * @private
 */
zz.ide.services.FtService.prototype.openHandler_ = function( ){ };

/**
 * Service message event handler.
 * @param {zz.net.events.WebSocketClientMessage} input
 * @private
 */
zz.ide.services.FtService.prototype.messageHandler_ = function( input ){

    var data = input;
    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );

    var filesTreeModel = new zz.ide.models.FilesTree( null,goog.json.unsafeParse( datarow.data ) );
    var filesTreeDatarow = /** @type {zz.ide.models.FilesTreeDatarow} */ ( filesTreeModel.firstDatarow( ) );

    try{
        if( data.messageTarget === zz.ide.enums.Command.GET_CHILDREN ){

            this.getChildren_( filesTreeDatarow );

        }else if( data.messageTarget === zz.ide.enums.Command.OPEN_FILE ){

            this.openFile_( filesTreeDatarow );

        }else if( data.messageTarget === zz.ide.enums.Command.SAVE_FILE ){

            this.saveFile_( filesTreeDatarow );

        }

        this.wsc_.sendCommandMessage( data.messageSource, filesTreeModel, data.messageTarget );

    }catch( e ){

        this.wsc_.sendErrorMessage( data.messageSource, zz.net.enums.MessageType.ERROR, '' + e );
    }
};

/**
 * Get files and directories as children from specified path in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @private
 */
zz.ide.services.FtService.prototype.getChildren_ = function( treeDatarow ){

    var childrenTree = treeDatarow.children;
    var path = this.normalizePath_( treeDatarow.path );

    var children = this.ft_.getDirectories( path );
    goog.array.forEach( children, function( path, index ){

        childrenTree.createLast([
            path.substring( path.lastIndexOf( this.ft_.CONST.PATH_DELIMITER ) + 1 ),
            zz.ide.enums.Const.FOLDER,
            this.denormalizePath_( path ),
            ''
        ] );

    }, this );

    children = this.ft_.getFiles( path );
    goog.array.forEach( children, function( path, index ){

        childrenTree.createLast([
            path.substring( path.lastIndexOf( this.ft_.CONST.PATH_DELIMITER ) + 1 ),
            zz.ide.enums.Const.FILE,
            this.denormalizePath_( path ),
            ''
        ] );

    }, this );
};

/**
 * Get file content specified in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @private
 */
zz.ide.services.FtService.prototype.openFile_ = function( treeDatarow ){

    var path = this.normalizePath_( treeDatarow.path );
    treeDatarow.content = this.ft_.openFile( path );
};

/**
 * Save file content specified in datarow.
 * @param {zz.ide.models.FilesTreeDatarow} treeDatarow
 * @private
 */
zz.ide.services.FtService.prototype.saveFile_ = function( treeDatarow ){

    var path = this.normalizePath_( treeDatarow.path );
    this.ft_.saveFile( path, treeDatarow.content );
    this.openFile_( treeDatarow );
};

/**
 * Transforming passed pseudo path into a real absolute path independently of OS.
 * @param {string} path is pseudo or absolute path.
 * @return {string}
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
 */
zz.ide.services.FtService.prototype.denormalizePath_ = function( path ){

    return path.replace( this.MODULE_ROOT_REG_EXP_, '' ).replace( this.FILE_DELIM_REG_EXP_, '/' );
};

var ftService = new zz.ide.services.FtService( 'ws://localhost:7777' );


