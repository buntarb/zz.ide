// Copyright 2016 Artem Lytvynov <buntarb@gmail.com>. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

goog.provide( 'zz.ide.controllers.Ace' );

goog.require( 'goog.dom' );
goog.require( 'goog.array');
goog.require( 'goog.json');
goog.require( 'goog.Timer');
goog.require( 'goog.Promise');

goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.CssClass' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.TernApi' );
goog.require( 'zz.ide.views.Ace' );
goog.require( 'zz.ide.models.Ace' );
goog.require( 'zz.ide.models.PopupSearchlist' );
goog.require( 'zz.ide.models.HistoryList' );
goog.require( 'zz.ide.models.TernResponse' );
goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.controllers.HistoryList' );

goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.net.models.ErrorDataset' );
goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.WebSocketClient' );

goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.environment.enums.EventType' );

/**
 * Ace controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Ace = function( opt_dom ){

    /**
     * Ace editor change event timer id.
     * @type {number}
     * @private
     */
    this.changedTimerId_ = undefined;

    /**
     * @private
     */
    this.autocompletePromise_ = undefined;

    /**
     * Auto complete promise resolve function.
     * @type {Function}
     * @private
     */
    this.autocompletePromiseResolver_ = undefined;

    /**
     * Auto complete promise reject function.
     * @type {Function}
     * @private
     */
    this.autocompletePromiseRejecter_ = undefined;

    // Basic inheritance.
    goog.base(

        this,
        new zz.ide.models.Ace( ),
        zz.ide.views.Ace.getInstance( ),
        opt_dom );
};
goog.inherits( zz.ide.controllers.Ace, zz.ide.controllers.BaseViewController );

/**
 * @override
 */
zz.ide.controllers.Ace.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
        zz.ide.enums.Command.GET_CHILDREN,
        this.getChildrenHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
        zz.ide.enums.Command.OPEN_FILE,
        this.openFileHandler_,
        false,
        this
    );
    if( !this.getWSClient( ).isReady( ) ){

        this.getHandler( ).listenWithScope(

            this.getWSClient( ),
            zz.net.enums.EventType.WEB_SOCKET_READY,
            this.updateRequest,
            false,
            this
        );
    }
    this.getHandler( ).listenWithScope(

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getModel( ),

        zz.models.enums.EventType.DATAROW_UPDATE,
        this.compileHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
        zz.ide.enums.Command.TERN_REQUEST,
        this.ternResponseHandler_,
        false,
        this
    );

    this.getHandler( ).listen(

        this.getModel( ),
        zz.models.enums.EventType.DATAROW_UPDATE,
        this.searchHandler_,
        false
    );

    this.getHandler( ).listen(

        this.router_,
        zz.environment.enums.EventType.ROUTED,
        this.routeChangedHandler_,
        false,
        this
    );
};

/**
 * @override
 */
zz.ide.controllers.Ace.prototype.bootstrap = function( ){

    this.updateRequest( );
};

/**
 * Initialize ace editor.
 * @private
 */
zz.ide.controllers.Ace.prototype.initializeEditor_ = function( ){

    var self = this;
    var datarow = this.getModel( ).lastDatarow( );
    datarow.height = zz.environment.services.Environment

            .getInstance( )
            .viewport
            .getSize( )
            .height - zz.ide.enums.Const.CORRECTION_HEIGHT;

    this.editor_ = goog.global[ 'ace' ][ 'edit' ]( zz.ide.enums.CssClass.ACE_EDITOR );
    this.editor_[ '$blockScrolling' ] = Infinity;
    this.editor_[ 'setTheme' ]( datarow.theme );
    this.editor_[ 'getSession' ]( )[ 'setMode' ]( datarow.syntax );
    this.editor_[ 'setValue' ]( datarow.content, -1 );
    //this.editor_[ 'resize' ]( true );
    this.editor_[ 'scrollToLine' ]( datarow.lineNumber, false, false, function( ){ } );
    this.editor_[ 'moveCursorToPosition' ]( {

        'row': datarow.lineNumber - 1,
        'column': datarow.columnNumber - 1
    } );
    //this.editor_[ 'resize' ]( true );

    this.editor_[ 'focus' ]( );
    this.getView( ).setHeight( datarow.height );
    this.getModel( ).lastDatarow( ).numberOfLines = this.editor_[ 'session' ][ 'getLength' ]( );

    this.autocomplete_ = goog.global[ 'ace' ][ 'require' ]( 'ace/ext/language_tools' );
    this.autocomplete_[ 'addCompleter' ]( {

        'getCompletions': function( editor, session, pos, prefix, callback ){

            if( self.autocompletePromise_ ){

                self.autocompletePromise_.cancel( );
                self.autocompletePromise_ = undefined;
                self.autocompletePromiseResolver_ = undefined;
                self.autocompletePromiseRejecter_ = undefined;
            }
            self.autocompletePromise_ = new goog.Promise( function( resolve, reject ){

                self.autocompletePromiseResolver_ = resolve;
                self.autocompletePromiseRejecter_ = reject;

            } );
            self.autocompletePromise_.then( function( list ){

                callback( null, list );
            } );
            zz.ide.services.TernApi

                .getInstance( )
                .sendAutocompletionRequest(

                    self.requestPath_,
                    self.editor_[ 'getCursorPosition' ]( )[ 'row' ],
                    self.editor_[ 'getCursorPosition' ]( )[ 'column' ],
                    self.editor_[ 'getValue' ]( ) );
        }
    } );

    this.editor_[ 'setOptions' ]( {

        'enableBasicAutocompletion': true,
        'enableLiveAutocompletion': false,
        'enableSnippets': false
    } );
    this.editor_[ 'getSession' ]( )[ 'on' ](

        'change',
        goog.bind( this.editorChangedHandler_, this ) );

    this.editor_[ 'selection' ][ 'on' ](

        'changeCursor',
        goog.bind( this.editorCursorChangedHandler_, this ) );
};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.dispose = function( ){

    this.saveFile_( );

    if( this.autocompletePromise_ ){

        this.autocompletePromise_.cancel( );
        this.autocompletePromise_ = undefined;
        this.autocompletePromiseResolver_ = undefined;
        this.autocompletePromiseRejecter_ = undefined;
    }
    this.autocomplete_[ 'setCompleters' ]( );
    this.editor_[ 'destroy' ]( );
    this.editor_ = undefined;
    this.autocomplete_ = undefined;
    goog.base( this, 'dispose' );
};

/**
 * Get ace mode.
 * @param {string} fileType
 * @return {string}
 * @private
 */
zz.ide.controllers.Ace.prototype.getAceMode_ = function( fileType ){

    var aceMode;
    switch( fileType ){

        case zz.ide.enums.Const.JS:

            aceMode = zz.ide.enums.Const.ACE_MODE_JS;
            break;

        case zz.ide.enums.Const.YAML:

            aceMode = zz.ide.enums.Const.ACE_MODE_YAML;
            break;

        case zz.ide.enums.Const.SCSS:

            aceMode = zz.ide.enums.Const.ACE_MODE_SCSS;
            break;

        case zz.ide.enums.Const.SOY:

            aceMode = zz.ide.enums.Const.ACE_MODE_SOY;
            break;

        case zz.ide.enums.Const.JSON:

            aceMode = zz.ide.enums.Const.ACE_MODE_JSON;
            break;

        case zz.ide.enums.Const.TPL:

            aceMode = zz.ide.enums.Const.ACE_MODE_TPL;
            break;

        default:

            break;
    }
    return aceMode;
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Ace.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionShowHistory( e ) ){

        if( this.layout_.getModel( ).lastDatarow( ).popup.length &&

            this.layout_.getModel( ).lastDatarow( ).popup.lastDatarow().id === 'history-list' ){

            this.layout_.closePopup( );

        }else{

            this.layout_.openPopup(

                'history-list',
                undefined,
                undefined,
                300,
                goog.style.getClientPosition( this.getElement( ) ).y + 26,
                goog.style.getClientPosition( this.getElement( ) ).x );

            var historyListModel = new zz.ide.models.HistoryList( );
            var historyListController =
                new zz.ide.controllers.HistoryList( historyListModel );

            this.layout_.getPopupController( ).renderChildController(

                historyListController,
                goog.dom.getElement( zz.ide.enums.CssClass.POPUP )
            );
        }
    }if( this.getView( ).isActionSaveFile( e ) ){

        this.saveFile_( );

    }if( this.getView( ).isActionFindInFile( e ) ){

        this.editor_[ 'execCommand' ]( 'find' );

    }if( this.getView( ).isActionReplaceInFile( e ) ){

        this.editor_[ 'execCommand' ]( 'replace' );
    }
    e.stopPropagation( );
};

/**
 * Route changed event handler.
 * @param {zz.environment.events.Routed} e
 * @private
 */
zz.ide.controllers.Ace.prototype.routeChangedHandler_ = function( e ){

    if( e.getPrevFragment( ) === this.getRoute( ) ){

        this.saveFile_( );
    }
};
/**
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.getChildrenHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var getChildrenMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
        if( getChildrenMessageModel.firstDatarow( ).error.length ){

            zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .getLayoutController( )
                .openError(

                    true,
                    false,
                    100,
                    200,
                    getChildrenMessageModel

                        .firstDatarow( )
                        .error
                );
        }else{

            var model = this.getModel( );
            if( model.length ){

                while( model.deleteCurrent( ) ){}
            }
        }
    }
    e.stopPropagation( );
};

/**
 * Open file event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Ace.prototype.openFileHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var openFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
        if( openFileMessageModel.firstDatarow( ).stderr.length ){

            zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .getLayoutController( )
                .openError(

                    true,
                    false,
                    100,
                    200,
                    openFileMessageModel

                        .firstDatarow( )
                        .stderr
                );
        }else{

            var fileType = openFileMessageModel

                .firstDatarow( )
                .path
                .slice(

                    goog.array.lastIndexOf(

                        openFileMessageModel.firstDatarow( ).path,
                        '.'

                    ) + 1
                );
            var name = openFileMessageModel

                .firstDatarow( )
                .path
                .slice(

                    goog.array.lastIndexOf(

                        openFileMessageModel.firstDatarow( ).path,
                        '/'

                    ) + 1
                );
            var model = this.getModel( );
            var lineNumber = model.lastDatarow( ).lineNumber ? model.lastDatarow( ).lineNumber : 1;
            var columnNumber = model.lastDatarow( ).columnNumber ? model.lastDatarow( ).columnNumber : 1;
            if( model.length ){

                while( model.deleteCurrent( ) ){}
            }
            this.getModel( )

                .createLast( [

                    zz.ide.enums.Const.ACE_THEME_CHROME,
                    this.getAceMode_( fileType ),
                    undefined,
                    openFileMessageModel.firstDatarow( ).content,
                    name,
                    zz.ide.enums.Const.FILE,
                    openFileMessageModel.firstDatarow( ).path,
                    undefined,
                    undefined,
                    lineNumber,
                    columnNumber
                ] );
            this.initializeEditor_( );
        }
    }

    e.stopPropagation( );
};

/**
 * Compile app handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Ace.prototype.compileHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        if( this.editor_ ){

            this.editor_[ 'setReadOnly' ](

                zz.environment.services.Environment

                    .getInstance( )
                    .getRootController( )
                    .getLayoutController( )
                    .getModel( )
                    .lastDatarow( )
                    .compiling
            );
        }
    }
};

/**
 * Tern response handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Ace.prototype.ternResponseHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var ternResponseMessageModel = new zz.ide.models.TernResponse( undefined, e.getDataJson( ) );
        if( ternResponseMessageModel.firstDatarow( ).stderr.length ){

            zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .getLayoutController( )
                .openError(

                    true,
                    false,
                    100,
                    200,
                    ternResponseMessageModel

                        .firstDatarow( )
                        .stderr
                );
        }else{

            if( ternResponseMessageModel.firstDatarow( ).type === 'completions' ){

                var score = 10000;
                var response = goog.json.parse(

                    ternResponseMessageModel

                        .firstDatarow( )
                        .response );

                this.autocompletePromiseResolver_(

                    goog.array.map( response[ 'completions' ],
                        function( item ){

                            return { 'value': item, 'score': score-- };
                        } )
                );
            }
            console.log( goog.json.parse(

                ternResponseMessageModel

                    .firstDatarow( )
                    .response ) );
        }
    }
};

/**
 * Ace editor change event handler.
 * @param {Object} e
 * @private
 */
zz.ide.controllers.Ace.prototype.editorChangedHandler_ = function( e ){

    if( this.changedTimerId_ ){

        goog.Timer.clear( this.changedTimerId_ );
    }
    this.changedTimerId_ = goog.Timer

        .callOnce(

            this.editorChangedTimerHandler_,
            zz.ide.enums.Const.SAVE_FILE_DELAY,
            this );
};

/**
 * Ace editor change cursor event handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.editorCursorChangedHandler_ = function( ){

    this.getModel( ).lastDatarow( ).lineNumber = this.editor_[ 'selection' ].getCursor( ).row + 1;
    this.getModel( ).lastDatarow( ).columnNumber = this.editor_[ 'selection' ].getCursor( ).column + 1;
};
/**
 * Ace editor change event timer handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.editorChangedTimerHandler_ = function( ){

    this.getModel( ).lastDatarow( ).numberOfLines = this.editor_[ 'session' ][ 'getLength' ]( );
};

/**
 * Ace editor change event timer handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.saveFile_ = function( ){

    if( this.getModel( ) ){

        this.getModel( )

            .lastDatarow( )
            .content = this.editor_[ 'getValue' ]( );

        zz.ide.services.ClientApi

            .getInstance( )
            .saveFile(

                this.getModel( ).lastDatarow( ).name,
                this.getModel( ).lastDatarow( ).path,
                this.getModel( ).lastDatarow( ).content );
    }
};
/**
 * Search input change event handler.
 * @param {zz.models.events.DatarowUpdate} e
 * @private
 */
zz.ide.controllers.Ace.prototype.searchHandler_ = function( e ){

    if( e.message.datafield === this.getModel( ).datafield.search ){

        var value = e.message.new_value;

        this.getLayout( ).closePopup( );
        if( value !== '' ){

            value = value.replace( /\./g, '[.]' );

            var regExp = new RegExp( value, 'g' );

            var searchData = [

                "zz.ide.controllers.Header",
                "zz.ide.controllers.Layout",
                "zz.ide.controllers.Navigation",
                "zz.ide.views.Header",
                "zz.ide.views.Layout",
                "zz.ide.views.Navigation"
            ];
            var popupSearchlistModel = new zz.ide.models.PopupSearchlist( );

            goog.array.forEach( searchData, function( searchItem ){

                if( goog.dom.pattern.matchStringOrRegex( regExp, searchItem ) ){

                    popupSearchlistModel.createLast( [ searchItem ] );
                }
            } );

            if( popupSearchlistModel.length ){

                this.getLayout( ).openPopup(

                    'ace-search',
                    undefined,
                    undefined,
                    300,
                    36,
                    goog.style.getClientPosition( this.getElement( ) ).x
                    + goog.style.getSize( this.getElement( ) ).width
                    - 300
                );
                var popupSearchlistController = new zz.ide.controllers.PopupSearchlist( popupSearchlistModel );
                this.getLayout( ).getPopupController( ).renderChildController(

                    popupSearchlistController,
                    goog.dom.getElement( zz.ide.enums.CssClass.POPUP )
                );
            }
        }else{

            this.getLayout( ).closePopup( );
        }
    }

    e.stopPropagation( );
};


/**
 * Send request to server to get file.
 */
zz.ide.controllers.Ace.prototype.updateRequest = function( ){

    if( this.getWSClient( ).isReady( ) ){

        var path;
        var folder = this.getRouter( )

            .getFragment( )
            .slice(

                0,
                goog.array.lastIndexOf(

                    this.getRouter( ).getFragment( ),
                    '/' )
            );
        if( folder === '' ){

            this.requestPath_ = zz.ide.services.RouteToPath

                .getInstance( )
                .getPath(

                    this.getRouter( ).getFragment( ) );

        }else{

            path = zz.ide.services.RouteToPath

                .getInstance( )
                .getPath( folder );

            var name = this.getRouter( )

                .getFragment( )
                .slice(

                    goog.array.lastIndexOf(

                        this.getRouter( ).getFragment( ),
                        '='

                    ) + 1
                );
            this.requestPath_ = path + '/' + name;
        }
        zz.ide.services.ClientApi

            .getInstance( )
            .getFiles(

                this.requestPath_,
                zz.ide.enums.Const.FILE );
    }
};
