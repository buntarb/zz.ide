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

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Ace' );
goog.require( 'zz.ide.models.Ace' );

goog.require( 'zz.net.enums.EventType' );
goog.require( 'zz.net.WebSocketClient' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Ace controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Ace = function( opt_dom ){

    var model = new zz.ide.models.Ace( );
    var view = zz.ide.views.Ace.getInstance( );

    goog.base( this, model, view, opt_dom );

    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );
};

goog.inherits( zz.ide.controllers.Ace, zz.controllers.FEBase );

/**
 *  @override.
 */
zz.ide.controllers.Ace.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.GET_CHILDREN,
        this.getChildrenHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.OPEN_FILE,
        this.openFileHandler_,
        false,
        this
    );
    if( !this.wsc_.isReady( ) ){

        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.net.enums.EventType.WEB_SOCKET_READY,
            this.setupModelInternal,
            false,
            this
        );
    }
};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.setupModelInternal = function( ){

    //if( this.wsc_.isReady( ) ){
    //
    //    var path;
    //
    //    switch( this.router_.getFragment( ) ){
    //
    //        case zz.ide.enums.Route.MODELS:
    //
    //            path = zz.ide.enums.Path.MODELS;
    //            break;
    //
    //        default:
    //
    //            break;
    //    }
    //    zz.ide.services.ClientApi.getInstance( ).getFiles( path, zz.ide.enums.Const.FILE );
    //}
};

/**
 * Initialize ace editor.
 * @private
 */
zz.ide.controllers.Ace.prototype.initializeEditor_ = function(  ){

    var datarow = this.getModel( ).lastDatarow( );

    datarow.height =

        zz.environment.services.Environment.getInstance( ).viewport.getSize( ).height

        - zz.ide.enums.Const.CORRECTION_HEIGHT;

    var editor = window[ 'ace' ][ 'edit' ]( goog.getCssName( 'ace' ) );
    editor[ 'setTheme' ]( datarow.theme );
    editor[ 'getSession' ]( )[ 'setMode' ]( datarow.syntax );
    editor[ 'setValue' ]( datarow.content, -1 );

    var self = this;
    var id;

    editor[ 'getSession' ]( ).on( 'change', function( e ){

        if( id ){

            goog.Timer.clear( id );
        }
        id = goog.Timer.callOnce( function( ){

            self.getModel( ).lastDatarow( ).content = editor[ 'getValue' ]( );
            zz.ide.services.ClientApi.getInstance( ).saveFile(

                self.getModel( ).lastDatarow( ).name,
                self.getModel( ).lastDatarow( ).path,
                self.getModel( ).lastDatarow( ).content );

        }, zz.ide.enums.Const.SAVE_FILE_DELAY );
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

    if( openFileMessageModel.firstDatarow( ).error ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openError( true, false, 100, 200, error );

    }else if( zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getOpenFile( ) ){

       var fileType = openFileMessageModel.firstDatarow( ).path

           .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '.' ) + 1 );

        var name = openFileMessageModel.firstDatarow( ).path

            .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) + 1 );

        var aceMode;
        var model = this.getModel( );

        if( fileType === zz.ide.enums.Const.JS ){

            aceMode = zz.ide.enums.Const.ACE_MODE_JS;

        }else if( fileType === zz.ide.enums.Const.YAML ){

            aceMode = zz.ide.enums.Const.ACE_MODE_YAML;

        }else if( fileType === zz.ide.enums.Const.SCSS ){

            aceMode = zz.ide.enums.Const.ACE_MODE_SCSS;

        }else if( fileType === zz.ide.enums.Const.SOY ){

            aceMode = zz.ide.enums.Const.ACE_MODE_SOY;

        }else if( fileType === zz.ide.enums.Const.JSON ){

            aceMode = zz.ide.enums.Const.ACE_MODE_JSON;

        }else if( fileType === zz.ide.enums.Const.TPL ){

            aceMode = zz.ide.enums.Const.ACE_MODE_TPL;
        }

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