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
goog.require( 'zz.ide.models.TernResponse' );
goog.require( 'zz.ide.controllers.BaseViewController' );

goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.net.models.ErrorDataset' );
goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.WebSocketClient' );

goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );

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
            this.setupModelInternal,
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
        zz.ide.enums.Command.GET_CHILDREN,
        this.getChildrenHandler_,
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
};

/**
 * @override
 */
zz.ide.controllers.Ace.prototype.setupModelInternal = function( ){

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
};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.dispose = function( ){

    this.getModel( )

        .lastDatarow( )
        .content = this.editor_[ 'getValue' ]( );

    zz.ide.services.ClientApi

        .getInstance( )
        .saveFile(

            this.getModel( ).lastDatarow( ).name,
            this.getModel( ).lastDatarow( ).path,
            this.getModel( ).lastDatarow( ).content );

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
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.getChildrenHandler_ = function( e ){

    var getChildrenMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
    if( getChildrenMessageModel.firstDatarow( ).error.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getChildAt( 0 )
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
    e.stopPropagation( );
};

/**
 * Open file event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Ace.prototype.openFileHandler_ = function( e ){

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
                openFileMessageModel.firstDatarow( ).path
            ] );
        this.initializeEditor_( );
    }

    e.stopPropagation( );
};

/**
 * Compile app handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Ace.prototype.compileHandler_ = function( e ){

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
};

/**
 * Tern response handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Ace.prototype.ternResponseHandler_ = function( e ){

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
 * Ace editor change event timer handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.editorChangedTimerHandler_ = function( ){

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
    this.getModel( ).lastDatarow( ).numberOfLines = this.editor_[ 'session' ][ 'getLength' ]( );
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