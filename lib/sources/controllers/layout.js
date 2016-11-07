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

goog.provide( 'zz.ide.controllers.Layout' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.pattern' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Command' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.controllers.ModalAddFile' );

goog.require( 'zz.app.controllers.FEBaseLayout' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.controllers.enums.EventType' );

/**
 * Layout controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.app.controllers.FEBaseLayout}
 */
zz.ide.controllers.Layout = function( opt_dom ){

    var model = new zz.ide.models.Layout( );
    var view = zz.ide.views.Layout.getInstance( );
    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Layout, zz.app.controllers.FEBaseLayout );

/**
 *  @override
 */
zz.ide.controllers.Layout.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.blockActionHandler_,
        true,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_APP,
        this.compileHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_SOY,
        this.compileHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_CSS,
        this.compileHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_MODELS,
        this.compileHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.CALCDEPS,
        this.compileHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.router_,
        zz.environment.enums.EventType.ROUTED,
        this.routeChangedHandler_,
        false,
        this
    );

};

/**
 *  @override
 */
zz.ide.controllers.Layout.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( [ undefined, undefined, undefined, undefined, undefined, true ] );
    this.routeChangedHandler_( );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.actionHandler_ = function( e ){

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.ADD_BTN ) ){

        if( !zz.environment.services.Environment.getInstance( )

                .getRootController( )
                .getLayoutController( )
                .getModel(  )
                .lastDatarow( )
                .modal
                .length ){

            this.openModal( true, false, 200, 100, '' );

            var path;
            switch( this.router_.getFragment( ) ){

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

            /**
             * Modal window for delete file controller.
             * @type {zz.ide.controllers.ModalAddFile}
             */
            var modalAddController = new zz.ide.controllers.ModalAddFile( path );
            modalAddController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );
        }

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_APP ) ){

        if( !this.getModel( ).lastDatarow( ).compilingApp ){

            zz.ide.services.ClientApi.getInstance( ).compileApp( );
        }
        this.getModel( ).lastDatarow( ).compiling = true;

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_SOY ) ){

        if( !this.getModel( ).lastDatarow( ).compilingSoy ){

            zz.ide.services.ClientApi.getInstance( ).compileSoy( );
        }
        this.getModel( ).lastDatarow( ).compiling = true;
        this.getModel( ).lastDatarow( ).compilingSoy = true;

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_STYLES ) ){

        if( !this.getModel( ).lastDatarow( ).compilingStyles ){

            zz.ide.services.ClientApi.getInstance( ).compileStyles( );
        }
        this.getModel( ).lastDatarow( ).compiling = true;
        this.getModel( ).lastDatarow( ).compilingStyles = true;

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_MODELS ) ){

        if( !this.getModel( ).lastDatarow( ).compilingModels ){

            zz.ide.services.ClientApi.getInstance( ).compileModels( );
        }
        this.getModel( ).lastDatarow( ).compiling = true;
        this.getModel( ).lastDatarow( ).compilingModels = true;

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CALCULATING_DEPS ) ){

        if( !this.getModel( ).lastDatarow( ).calculatingDeps ){

            zz.ide.services.ClientApi.getInstance( ).calculateDeps( );
        }
        this.getModel( ).lastDatarow( ).compiling = true;
        this.getModel( ).lastDatarow( ).calculatingDeps = true;
    }

    e.stopPropagation( );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.blockActionHandler_ = function( e ){

    if( this.getModel( ).lastDatarow().compiling ){

        e.stopPropagation( );
        e.preventDefault( );
    }
};
/**
 * Compile event handler.
 * @private
 */
zz.ide.controllers.Layout.prototype.compileHandler_ = function( e ){

    var compilerMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
    if( compilerMessageModel.firstDatarow( ).error.length ){

        this.openError(

            true,
            false,
            100,
            200,
            compilerMessageModel

                .firstDatarow( )
                .error );

    }else{

        console.log( 'compile respond', e );
    }
    switch( e.type ){

        case zz.ide.enums.Command.COMPILE_APP:

            this.getModel( ).lastDatarow( ).compiling = false;
            break;

        case zz.ide.enums.Command.COMPILE_SOY:

            this.getModel( ).lastDatarow( ).compiling = false;
            this.getModel( ).lastDatarow( ).compilingSoy = false;
            break;

        case zz.ide.enums.Command.COMPILE_MODELS:

            this.getModel( ).lastDatarow( ).compiling = false;
            this.getModel( ).lastDatarow( ).compilingModels = false;
            break;

        case zz.ide.enums.Command.COMPILE_CSS:

            this.getModel( ).lastDatarow( ).compiling = false;
            this.getModel( ).lastDatarow( ).compilingStyles = false;
            break;

        case zz.ide.enums.Command.CALCDEPS:

            this.getModel( ).lastDatarow( ).compiling = false;
            this.getModel( ).lastDatarow( ).calculatingDeps = false;
            break;
    }

};

/**
 * Route changed handler.
 * @param {zz.environment.events.Routed=} opt_e
 */
zz.ide.controllers.Layout.prototype.routeChangedHandler_ = function( opt_e ){

    var route;
    if( opt_e ){

        route = opt_e.getCurrFragment( );

    }else{

        route = this.router_.getFragment( );
    }

    if( goog.dom.pattern.matchStringOrRegex( /file=/g, route ) ){

        this.getModel( ).lastDatarow( ).addBtnShow = false;

    }else{

        this.getModel( ).lastDatarow( ).addBtnShow = true;
    }
};

/**
 *  Open modal window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string=} opt_title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Layout.prototype.openModal = function(

    showClose,
    showResize,
    height,
    width,
    opt_title,
    opt_top,
    opt_left ){

    this.getModel( )

        .lastDatarow( )
        .modal
        .createLast( [

            showClose,
            showResize,
            height,
            width,
            opt_title,
            opt_top,
            opt_left
        ] );
};

/**
 *  Close modal window.
 */
zz.ide.controllers.Layout.prototype.closeModal = function( ){

    this.getModel( ).lastDatarow( ).modal.deleteLast( );
};


/**
 *  Open error window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string} title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Layout.prototype.openError = function(

    showClose,
    showResize,
    height,
    width,
    title,
    opt_top,
    opt_left ){

    this.getModel( )

        .lastDatarow( )
        .error
        .createLast( [

            showClose,
            showResize,
            height,
            width,
            title,
            opt_top,
            opt_left
        ] );
};

/**
 *  Close error window.
 */
zz.ide.controllers.Layout.prototype.closeError = function( ){

    this.getModel( )

        .lastDatarow( )
        .error
        .deleteLast( );
};
