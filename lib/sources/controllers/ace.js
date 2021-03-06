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
goog.require( 'goog.array' );
goog.require( 'goog.json' );
goog.require( 'goog.Timer' );
goog.require( 'goog.Promise' );
goog.require( 'goog.dom.classlist' );

goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.EventType' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.PopupApi' );
goog.require( 'zz.ide.services.TooltipApi' );
goog.require( 'zz.ide.services.TernApi' );
goog.require( 'zz.ide.services.ViewStackApi' );
goog.require( 'zz.ide.services.ConstantsConverter' );

goog.require( 'zz.ide.views.Ace' );
goog.require( 'zz.ide.models.Ace' );
goog.require( 'zz.ide.models.PopupSearchlist' );
goog.require( 'zz.ide.models.HistoryList' );
goog.require( 'zz.ide.models.TernResponse' );
goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.controllers.HistoryList' );
goog.require( 'zz.ide.controllers.Tabs' );
goog.require( 'zz.ide.controllers.ModalError' );

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

    this.viewStackApi_ = zz.ide.services.ViewStackApi.getInstance( );

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

    this.getHandler( ).listen(

        this,
        zz.ide.enums.EventType.OPEN_TAB,
        this.openTabHandler_,
        false
    );

    this.getHandler( ).listen(

        this,
        zz.ide.enums.EventType.REMOVE_TAB,
        this.removeTabHandler_,
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

    this.getHandler( ).listen(

        zz.environment.services.Environment.getInstance( ),
        zz.environment.enums.EventType.RESIZE,
        this.resizeHandler_,
        false
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
    this.editor_[ 'getSession' ]( )[ 'setValue' ]( datarow.content, -1 );
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

    //this is needed for scrolling to cursor position
    this.editor_[ 'navigateWordRight' ]( );
    this.editor_[ 'navigateWordLeft' ]( );

};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.dispose = function( ){

    this.saveFile( );

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
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Ace.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionShowHistory( e ) ){

        if( zz.ide.services.PopupApi

                .getInstance( )
                .getPopupModel( )
                .length &&

            zz.ide.services.PopupApi

                .getInstance( )
                .getPopupModel( )
                .lastDatarow( ).id === 'history-list' ){

            zz.ide.services.PopupApi

                .getInstance( )
                .closePopup( );

        }else{

            zz.ide.services.PopupApi

                .getInstance( )
                .openPopup(

                'history-list',
                undefined,
                undefined,
                280,
                goog.style.getClientPosition( this.getElement( ) ).y + 37,
                goog.style.getClientPosition(

                    goog.dom.getElementByClass(

                        zz.ide.enums.CssClass.ACE_HISTORY,
                        this.getElement( )
                    )
                ).x - 256
            );

            var historyListModel = new zz.ide.models.HistoryList( );
            var historyListController =
                new zz.ide.controllers.HistoryList( historyListModel );

            zz.ide.services.PopupApi

                .getInstance( )
                .renderChildController( historyListController );
        }
        
    }else if( this.getView( ).isActionSaveFile( e ) ){

        this.saveFile( );

    }else if( this.getView( ).isActionFindInFile( e ) ){

        this.editor_[ 'execCommand' ]( 'find' );

    }else if( this.getView( ).isActionReplaceInFile( e ) ){

        this.editor_[ 'execCommand' ]( 'replace' );

    }else if( this.getView( ).isActionUndo( e ) ){

        this.editor_[ 'undo' ]( );

    }else if( this.getView( ).isActionRedo( e ) ){

        this.editor_[ 'redo' ]( );
    }
    e.stopPropagation( );
};

/**
 * Open tab event handler.
 * @param {zz.ide.events.OPEN_TAB} e
 * @private
 */
zz.ide.controllers.Ace.prototype.openTabHandler_ = function( e ){

    this.router_.setFragment( e.model.route );
    e.stopPropagation( );
};

/**
 * Remove tab event handler.
 * @param {zz.ide.events.REMOVE_TAB} e
 * @private
 */
zz.ide.controllers.Ace.prototype.removeTabHandler_ = function( e ){

    var prevRoute;
    var model = this.getModel( ).lastDatarow( ).tabs;
    var data = model.firstDatarow( );
    if( data ){

        if( model.firstDatarow( ) ){

            var loop = true;
            while( loop ){

                if( data.getUid( ) === e.model.getUid( ) ){

                    var isTabActive = model.currentDatarow( ).active;
                    model.deleteCurrent( );
                    if( isTabActive && model.firstDatarow( ) ){

                        prevRoute = model.firstDatarow( ).route;

                    }else if( isTabActive ){

                        prevRoute = this.viewStackApi_

                            .getViewStack( )[ this.viewStackApi_

                                                .getViewStack( ).length - 2 ]
                                                .route;
                    }

                    var controller = this.viewStackApi_.getCtrlFromViewStack( data.route );
                    this.viewStackApi_.removeElementFromViewStack( data.route );
                    if( isTabActive ){

                        this.router_.setFragment( prevRoute );
                    }else{

                        this.updateTabsModel( );
                        this.displayHistory( );
                    }
                    controller.disposeInternal( );
                    loop = false;

                }else{

                    data = model.nextDatarow( );
                }
            }
        }
    }
    e.stopPropagation( );
};
/**
 * Resize event handler.
 * @param {zz.environment.events.Resize} e
 * @private
 */
zz.ide.controllers.Ace.prototype.resizeHandler_ = function( e ){

    this.getModel( ).lastDatarow( ).height = zz.environment.services.Environment

            .getInstance( )
            .viewport
            .getSize( )
            .height - zz.ide.enums.Const.CORRECTION_HEIGHT;

    e.stopPropagation( );
};

/**
 * Route changed event handler.
 * @param {zz.environment.events.Routed} e
 * @private
 */
zz.ide.controllers.Ace.prototype.routeChangedHandler_ = function( e ){

    if( e.getPrevFragment( ) === this.getRoute( ) ){

        this.saveFile( );
    }
};
/**
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.getChildrenHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var getChildrenMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
        if( getChildrenMessageModel.firstDatarow( ).error

            && getChildrenMessageModel.firstDatarow( ).error.length ){

            zz.ide.services.ModalApi

                .getInstance( )
                .openError(

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

            zz.ide.services.ModalApi

                .getInstance( )
                .openError(

                    openFileMessageModel
                        .firstDatarow( )
                        .stderr
                );
        }else if( this.getModel( ).lastDatarow( ).content !== openFileMessageModel.firstDatarow( ).content ){

            var fileType = openFileMessageModel

                .firstDatarow( )
                .path
                .slice(

                    goog.array.lastIndexOf(

                        openFileMessageModel.firstDatarow( ).path,
                        '.'

                    ) + 1
                );
            var nameArray = openFileMessageModel.firstDatarow( ).path.split( '/' );
            var name = nameArray[ nameArray.length - 2 ] + '/' + nameArray[ nameArray.length - 1 ];
            var model = this.getModel( );
            var lineNumber = model.lastDatarow( ).lineNumber ? model.lastDatarow( ).lineNumber : 1;
            var columnNumber = model.lastDatarow( ).columnNumber ? model.lastDatarow( ).columnNumber : 1;
            if( model.length ){

                while( model.deleteCurrent( ) ){}
            }
            this.getModel( )

                .createLast( [

                    zz.ide.enums.Const.ACE_THEME_CHROME,
                    zz.ide.services.ConstantsConverter

                        .getInstance( )
                        .getAceModeFromFileType( fileType ),
                    undefined,
                    openFileMessageModel.firstDatarow( ).content,
                    name,
                    zz.ide.enums.Const.FILE,
                    openFileMessageModel.firstDatarow( ).path,
                    undefined,
                    undefined,
                    lineNumber,
                    columnNumber,
                    undefined,
                    undefined,
                    undefined
                ] );
            this.initializeEditor_( );

        }else if( this.getModel( ).lastDatarow( ).content === openFileMessageModel.firstDatarow( ).content ){

            this.editor_[ 'focus' ]( );
        }

        this.updateTabsModel( );
        this.displayHistory( );
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

            zz.ide.services.ModalApi

                .getInstance( )
                .openError(

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

    this.getModel( ).lastDatarow( ).lineNumber = this.editor_[ 'selection' ][ 'getCursor' ]( )[ 'row' ] + 1;
    this.getModel( ).lastDatarow( ).columnNumber = this.editor_[ 'selection' ][ 'getCursor' ]( )[ 'column' ] + 1;
};
/**
 * Ace editor change event timer handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.editorChangedTimerHandler_ = function( ){

    this.getModel( ).lastDatarow( ).numberOfLines = this.editor_[ 'session' ][ 'getLength' ]( );
    this.getModel( ).lastDatarow( ).canUndo = this.editor_[ 'getSession' ]( )[ 'getUndoManager' ]( )[ 'hasUndo' ]( );
    this.getModel( ).lastDatarow( ).canRedo = this.editor_[ 'getSession' ]( )[ 'getUndoManager' ]( )[ 'hasRedo' ]( );
};

/**
 * Ace editor change event timer handler.
 */
zz.ide.controllers.Ace.prototype.saveFile = function( ){

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

        zz.ide.services.PopupApi

            .getInstance( )
            .closePopup( );
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

                zz.ide.services.PopupApi

                    .getInstance( )
                    .openPopup(

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
                zz.ide.services.PopupApi

                    .getInstance( )
                    .renderChildController( popupSearchlistController );
            }
        }else{

            zz.ide.services.PopupApi

                .getInstance( )
                .closePopup( );
        }
    }else if( e.message.datafield === this.getModel( ).datafield.height ){

        this.getView( ).setHeight( this.getModel( ).lastDatarow( ).height );
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

            this.requestPath_ = zz.ide.services.ConstantsConverter

                .getInstance( )
                .getPathFromRoute(

                    this.getRouter( ).getFragment( ) );

        }else{

            path = zz.ide.services.ConstantsConverter

                .getInstance( )
                .getPathFromRoute( folder );

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

/**
 * Update tabs model.
 */
zz.ide.controllers.Ace.prototype.updateTabsModel = function( ){

    var model = this.getModel( ).lastDatarow( ).tabs;
    if( model && model.length ){

        while( model.deleteLast( ) ){}
    }
    var viewTabs = [];
    var viewStackFile = this.viewStackApi_.getViewStackFile( );
    viewStackFile = viewStackFile.reverse( );

    if( viewStackFile.length > 3 ){

        viewTabs = goog.array.splice( viewStackFile, 0, 3 );
    }else{

        viewTabs = viewStackFile;
    }

    goog.array.forEach( viewTabs, function( item ){

        var name = item.route.slice(

                0,
                goog.array.lastIndexOf(

                    item.route,
                    '?'

                )
            )

            + item.route.slice(

                goog.array.lastIndexOf(

                    item.route,
                    '='

                ) + 1 );
        var icon = zz.ide.services.ConstantsConverter.getInstance( ).getIconFromRoute( item.route );
        var cssClass = zz.ide.services.ConstantsConverter.getInstance( ).getClassFromRoute( item.route );
        model.createLast( [ name, item.route, icon, cssClass ] );
    } );
    this.markActiveTab( );
};

/**
 * Show or hide history.
 */
zz.ide.controllers.Ace.prototype.displayHistory = function( ){

    if( this.getModel( ).lastDatarow( ) ){

        this.getModel().lastDatarow().showHistory = this.viewStackApi_.displayHistoryStatus( );
    }
};


/**
 * Mark active tab.
 */
zz.ide.controllers.Ace.prototype.markActiveTab = function( ){

    var route = this.router_.getFragment( );
    var model = this.getModel( ).lastDatarow( ).tabs;
    var data = model.firstDatarow( );
    if( data ){

        do{

            data.active = data.route === route;

        }while( data = model.nextDatarow( ) );
    }
};