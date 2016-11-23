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
goog.require( 'goog.Timer');
goog.require( 'goog.array');

goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.Path' );

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

    var model = new zz.ide.models.Ace( );
    var view = zz.ide.views.Ace.getInstance( );

    goog.base( this, model, view, opt_dom );
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
};

/**
 * @override
 */
zz.ide.controllers.Ace.prototype.setupModelInternal = function( ){

    if( this.getWSClient( ).isReady( ) ){

        var path;

        var folder = this.getRouter( ).getFragment( )

            .slice( 0, goog.array.lastIndexOf( this.getRouter( ).getFragment( ), '/' ) );

        if( folder === '' ){

            this.requestPath_ = zz.ide.services.RouteToPath.getInstance( ).getPath( this.getRouter( ).getFragment( ) );

        }else{

            path = zz.ide.services.RouteToPath.getInstance().getPath( folder );

            var name = this.getRouter( ).getFragment( )

                .slice( goog.array.lastIndexOf( this.getRouter( ).getFragment( ), '=' ) + 1 );

            this.requestPath_ = path + '/' + name;
        }

        zz.ide.services.ClientApi.getInstance( ).getFiles( this.requestPath_, zz.ide.enums.Const.FILE );
    }
};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.dispose = function( ){

    this.getModel( ).lastDatarow( ).content = this.editor_[ 'getValue' ]( );
    zz.ide.services.ClientApi.getInstance( ).saveFile(

        this.getModel( ).lastDatarow( ).name,
        this.getModel( ).lastDatarow( ).path,
        this.getModel( ).lastDatarow( ).content );

    goog.base( this, 'dispose' );
};

/**
 * Initialize ace editor.
 * @private
 */
zz.ide.controllers.Ace.prototype.initializeEditor_ = function( ){

    var datarow = this.getModel( ).lastDatarow( );

    datarow.height =

        zz.environment.services.Environment.getInstance( ).viewport.getSize( ).height

        - zz.ide.enums.Const.CORRECTION_HEIGHT;

    this.editor_ = window[ 'ace' ][ 'edit' ]( goog.getCssName( 'ace' ) );
    this.editor_[ 'setTheme' ]( datarow.theme );
    this.editor_[ 'getSession' ]( )[ 'setMode' ]( datarow.syntax );
    this.editor_[ 'setValue' ]( datarow.content, -1 );

    var self = this;
    var id;

    this.editor_[ 'getSession' ]( ).on( 'change', function( e ){

        if( id ){

            goog.Timer.clear( id );
        }

        id = goog.Timer.callOnce( function( ){
            if( self.getModel( ) ){

                self.getModel( ).lastDatarow( ).content = self.editor_[ 'getValue' ]( );
                zz.ide.services.ClientApi.getInstance( ).saveFile(

                    self.getModel( ).lastDatarow( ).name,
                    self.getModel( ).lastDatarow( ).path,
                    self.getModel( ).lastDatarow( ).content );

            }
        }, zz.ide.enums.Const.SAVE_FILE_DELAY );

        zz.ide.services.TernApi.getInstance( ).get( self.getQuery( ) );
    });
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
            .openError( true, false, 100, 200, getChildrenMessageModel.firstDatarow( ).error );

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
 * @private
 */
zz.ide.controllers.Ace.prototype.openFileHandler_ = function( e ){

    var openFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( openFileMessageModel.firstDatarow( ).stderr.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openError( true, false, 100, 200, openFileMessageModel.firstDatarow( ).stderr );

    }else{

        var fileType = openFileMessageModel.firstDatarow( ).path

           .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '.' ) + 1 );

        var name = openFileMessageModel.firstDatarow( ).path

            .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) + 1 );

        var aceMode;
        var model = this.getModel( );

        aceMode = this.getAceMode_( fileType );

        if( model.length ){

            while( model.deleteCurrent( ) ){}
        }

        this.getModel( ).createLast( [

            zz.ide.enums.Const.ACE_THEME_CHROME,
            aceMode,
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
 * @private
 */
zz.ide.controllers.Ace.prototype.compileHandler_ = function( e ){

    if( this.editor_ ){

        this.editor_.setReadOnly( zz.environment.services.Environment

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
 * @param e
 * @private
 */
zz.ide.controllers.Ace.prototype.ternResponseHandler_ = function( e ){

    var data = e;

    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var model;
    var modelDatarow;

    if( datarow.type === zz.net.enums.MessageType.ERROR ){

        console.log( '========================RESPONSE ERROR========================' );

        model = new zz.net.models.ErrorDataset( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( model.firstDatarow( ) );
        console.log( modelDatarow.code + ': ' + modelDatarow.message );

    }else{

        model = new zz.ide.models.TernResponse( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = model.firstDatarow( );

        if( datarow.command === zz.ide.enums.Command.TERN_REQUEST ){

            console.log( '========================RESPONSE TERN_REQUEST========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );

            }else {

                console.log('modelDatarow.response = ' + modelDatarow.response);
                console.log('modelDatarow.type = ' + modelDatarow.type);
            }

        }else {

            console.log( '========================Unknown command: ' + datarow.command );

        }
    }
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
 * Get query
 * @return {Object}
 * @private
 */
zz.ide.controllers.Ace.prototype.getQuery = function( ){

    var query = {

        type: "completions",
        end: {

            line: this.editor_.getCursorPosition( ).row,
            ch: this.editor_.getCursorPosition( ).column
        },
        file: this.requestPath_,
        guess: true
    };

    return query;
};
