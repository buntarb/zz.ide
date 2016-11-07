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
 * @extend {zz.controllers.FEBase}
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

    this.folder_ = this.router_.getFragment( )

        .slice( 0, goog.array.lastIndexOf( this.router_.getFragment( ), '/' ) );
    console.log( this.folder_ );
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
};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.setupModelInternal = function( ){

    if( this.wsc_.isReady( ) ){

        var path, requestPath;

        var folder = this.router_.getFragment( )

            .slice( 0, goog.array.lastIndexOf( this.router_.getFragment( ), '/' ) );

        if( folder === '' ){

            switch( this.router_.getFragment( ) ) {

                case zz.ide.enums.Route.BASE_JS:

                    requestPath = zz.ide.enums.Path.BASE_JS;
                    break;

                case zz.ide.enums.Route.PACKAGE_JSON:

                    requestPath = zz.ide.enums.Path.PACKAGE_JSON;
                    break;

                case zz.ide.enums.Route.CONFIG_YAML:

                    requestPath = zz.ide.enums.Path.CONFIG_YAML;
                    break;

                default:

                    break;
            }
        }else{

            switch( folder ){

                case zz.ide.enums.Route.MODELS:

                    path = zz.ide.enums.Path.MODELS;
                    break;

                case zz.ide.enums.Route.TEMPLATES:

                    path = zz.ide.enums.Path.TEMPLATES;
                    break;

                case zz.ide.enums.Route.STYLES:

                    path = zz.ide.enums.Path.STYLES;
                    break;

                case zz.ide.enums.Route.MESSAGES:

                    path = zz.ide.enums.Path.MESSAGES;
                    break;

                case zz.ide.enums.Route.RESOURCES:

                    path = zz.ide.enums.Path.RESOURCES;
                    break;

                case zz.ide.enums.Route.CONTROLLERS:

                    path = zz.ide.enums.Path.CONTROLLERS;
                    break;

                case zz.ide.enums.Route.ENUMS:

                    path = zz.ide.enums.Path.ENUMS;
                    break;

                case zz.ide.enums.Route.ERRORS:

                    path = zz.ide.enums.Path.ERRORS;
                    break;

                case zz.ide.enums.Route.EVENTS:

                    path = zz.ide.enums.Path.EVENTS;
                    break;

                case zz.ide.enums.Route.FACTORIES:

                    path = zz.ide.enums.Path.FACTORIES;
                    break;

                case zz.ide.enums.Route.SERVICES:

                    path = zz.ide.enums.Path.SERVICES;
                    break;

                case zz.ide.enums.Route.VIEWS:

                    path = zz.ide.enums.Path.VIEWS;
                    break;

                case zz.ide.enums.Route.TESTS:

                    path = zz.ide.enums.Path.TESTS;
                    break;

                case zz.ide.enums.Route.INDEX:

                    path = zz.ide.enums.Path.INDEX;
                    break;

                default:

                    break;
            }

            var name = this.router_.getFragment( )

                .slice( goog.array.lastIndexOf( this.router_.getFragment( ), '=' ) + 1 );

            requestPath = path + '/' + name;
        }

        zz.ide.services.ClientApi.getInstance( ).getFiles( requestPath, zz.ide.enums.Const.FILE );
    }
};

/**
 *  @override
 */
zz.ide.controllers.Ace.prototype.dispose = function( ){

    //if( this.folder_ === '' ){
    //
    //    switch( this.router_.getFragment( ) ) {
    //
    //        case zz.ide.enums.Route.BASE_JS:
    //
    //            zz.ide.services.ClientApi.getInstance( ).calcdeps( );
    //            break;
    //
    //        default:
    //
    //            break;
    //    }
    //}else{ switch ( this.folder_ ) {
    //
    //        case zz.ide.enums.Route.MODELS:
    //
    //            zz.ide.services.ClientApi.getInstance( ).compileModels( );
    //            break;
    //
    //        case zz.ide.enums.Route.TEMPLATES:
    //
    //            zz.ide.services.ClientApi.getInstance( ).compileSoy( );
    //            break;
    //
    //        case zz.ide.enums.Route.STYLES:
    //
    //            zz.ide.services.ClientApi.getInstance( ).compileStyles( );
    //            break;
    //
    //        case zz.ide.enums.Route.MESSAGES:
    //
    //            break;
    //
    //        case zz.ide.enums.Route.RESOURCES:
    //
    //            break;
    //
    //        case zz.ide.enums.Route.INDEX:
    //
    //            break;
    //
    //        default:
    //
    //            zz.ide.services.ClientApi.getInstance( ).calcdeps( );
    //            break;
    //    }
    //}
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
            .openError( true, false, 100, 200, openFileMessageModel.firstDatarow( ).error );

    }else{

        var fileType = openFileMessageModel.firstDatarow( ).path

           .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '.' ) + 1 );

        var name = openFileMessageModel.firstDatarow( ).path

            .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) + 1 );

        var aceMode;
        var model = this.getModel( );

        switch( fileType ) {

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