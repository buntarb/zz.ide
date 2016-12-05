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
goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.app.controllers.FEBaseLayout' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.RouteToPath' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.controllers.ModalAddFile' );

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
goog.inherits(
    zz.ide.controllers.Layout,
    zz.app.controllers.FEBaseLayout );

/**
 *  @override
 */
zz.ide.controllers.Layout.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.blockHandler_,
        true,
        this
    );
    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_APP,
        this.compileMessageHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_SOY,
        this.compileMessageHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_CSS,
        this.compileMessageHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_MODELS,
        this.compileMessageHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.CALCDEPS,
        this.compileMessageHandler_,
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
    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.LEAVE,
        this.compileLeaveHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.ENTER,
        this.compileEnterHandler_,
        false,
        this
    );
};

/**
 *  @override
 */
zz.ide.controllers.Layout.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( [
        
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        true
    ] );
    this.routeChangedHandler_( );
};

/**
 * Handler for block {@code zz.controllers.events.Action} events.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.blockHandler_ = function( e ){

    if( this.getModel( ).lastDatarow( ).compiling ){

        e.stopPropagation( );
        e.preventDefault( );
    }
    if( this.getModel( ).lastDatarow( ).popup.length ){

        if( this.getModel( )
                .lastDatarow( )
                .popup
                .lastDatarow( )
                .id === 'services' &&

            e.controller
                .getView( )
                .isActionServicesButton &&

            e.controller
                .getView( )
                .isActionServicesButton( e ) ){

            e.stopPropagation( );
        }
        if( !goog.dom.contains(
                this.getPopupController( ).getElement( ),
                e.elements[ 0 ] ) ){

            this.closePopup( );
        }
    }
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionAddBtn( e ) ){

       this.openModalAddFile( );

    }else if( this.getView( ).isActionCompileApp( e ) ){

        this.startCompiling( zz.ide.enums.Command.COMPILE_APP );

    }else if( this.getView( ).isActionCompileSoy( e ) ){

        this.startCompiling( zz.ide.enums.Command.COMPILE_SOY );

    }else if( this.getView( ).isActionCompileStyles( e ) ){

        this.startCompiling( zz.ide.enums.Command.COMPILE_STYLES );

    }else if( this.getView( ).isActionCompileModels( e ) ){

        this.startCompiling( zz.ide.enums.Command.COMPILE_MODELS );

    }else if( this.getView( ).isActionCalculatingDeps( e ) ){

        this.startCompiling( zz.ide.enums.Command.CALCDEPS );

    }
    //else if( this.getView( ).isActionBackBtn( e ) ){
    //
    //    this.router_.back( );
    //
    //}else if( this.getView( ).isActionForwardBtn( e ) ){
    //
    //    this.router_.forward( );
    //}
    e.stopPropagation( );
};

/**
 * Mouse enter event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.compileEnterHandler_ = function( e ){

    this.getModel( ).lastDatarow( ).compileBtnBlur = false;
    e.stopPropagation( );
};

/**
 * Mouse leave event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.compileLeaveHandler_ = function( e ){

    this.getModel( ).lastDatarow( ).compileBtnBlur = true;
    e.stopPropagation( );
};

/**
 * WS message event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Layout.prototype.compileMessageHandler_ = function( e ){

    var compilerMessageModel =
        new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
        
    if( compilerMessageModel.firstDatarow( ).stdout.length ){

        this.openError(

            true,
            false,
            100,
            200,
            compilerMessageModel

                .firstDatarow( )
                .stdout );
    }
    if( compilerMessageModel.firstDatarow( ).stderr.length ){

        this.openError(

            true,
            false,
            100,
            200,
            compilerMessageModel

                .firstDatarow( )
                .stderr );
    }else{

        console.log( 'compile respond', e );
    }
    this.finishCompiling( e.type );
};

/**
 * Route changed event handler.
 * @param {zz.environment.events.Routed=} opt_e
 * @private
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
        this.getModel( ).lastDatarow( ).headerIsShown = false;

    }else{

        this.getModel( ).lastDatarow( ).addBtnShow = true;
        this.getModel( ).lastDatarow( ).headerIsShown = true;
    }
    //if( this.router_.getHistoryStack( ).length ){
    //
    //    this.getModel( ).lastDatarow( ).backBtnShow = true;
    //
    //}else{
    //
    //    this.getModel( ).lastDatarow( ).backBtnShow = false;
    //}
    //if( this.router_.getHistoryStackForward( ).length ){
    //
    //    this.getModel( ).lastDatarow( ).forwardBtnShow = true;
    //
    //}else{
    //
    //    this.getModel( ).lastDatarow( ).forwardBtnShow = false;
    //}
};

/**
 *  Open modal window.
 *  @param {string=} opt_id
 *  @param {string=} opt_title
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Layout.prototype.openModal = function(

    opt_id,
    opt_title,
    showClose,
    showResize,
    height,
    width,
    opt_top,
    opt_left ){

    this.getModel( )

        .lastDatarow( )
        .modal
        .createLast( [

            opt_id,
            opt_title,
            showClose,
            showResize,
            height,
            width,
            opt_top,
            opt_left
        ] );
};

/**
 *  Close modal window.
 */
zz.ide.controllers.Layout.prototype.closeModal = function( ){

    for( var i = 0; i < this.getModalController( ).getChildCount( ); i++ ){
        
        this.getModalController( ).getChildAt( i ).dispose( );
    }
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

    for( var i = 0; i < this.getErrorController( ).getChildCount( ); i++ ){
        
        this.getErrorController( ).getChildAt( i ).dispose( );
    }
    this.getModel( )

        .lastDatarow( )
        .error
        .deleteLast( );
};

/**
 *  Open popup window.
 *  @param {string} id
 *  @param {string} title
 *  @param {number} height
 *  @param {number} width
 *  @param {number} top
 *  @param {number} left
 */
zz.ide.controllers.Layout.prototype.openPopup = function(

    id,
    title,
    height,
    width,
    top,
    left ){

    while( this.getModel( ).lastDatarow( ).popup.deleteLast( ) ){}
    this.getModel( )

        .lastDatarow( )
        .popup
        .createLast( [

            id,
            title,
            height,
            width,
            top,
            left
        ] );
};

/**
 *  Close popup window.
 */
zz.ide.controllers.Layout.prototype.closePopup = function( ){

    for( var i = 0; i < this.getPopupController( ).getChildCount( ); i++ ){
        
        this.getPopupController( ).getChildAt( i ).dispose( ); 
    }
    this.getModel( )

        .lastDatarow( )
        .popup
        .deleteLast( );
};

/**
 * Open modal addfile window.
 */
zz.ide.controllers.Layout.prototype.openModalAddFile = function( ){

    if( !zz.environment.services.Environment.getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getModel(  )
            .lastDatarow( )
            .modal
            .length ){

        this.openModal(

            'addfile',
            '',
            true,
            false,
            215,
            380,
            goog.dom.getViewportSize( ).height/2 - 107,
            goog.dom.getViewportSize( ).width/2 - 190 );

        this.getModalController( )
        
            .renderChildController(
    
                new zz.ide.controllers.ModalAddFile(
                    
                    zz.ide.services.RouteToPath
            
                        .getInstance( )
                        .getPath( this.router_.getFragment( ) ) ),
                
                goog.dom.getElementByClass( zz.ide.enums.CssClass.MODAL_BODY ) );
    }
};

/**
 *  Start compiling files
 *  @param {string} command
 */
zz.ide.controllers.Layout.prototype.startCompiling = function( command ){

    switch( command ){

        case zz.ide.enums.Command.COMPILE_APP:

            if( !this.getModel( ).lastDatarow( ).compilingApp ){

                zz.ide.services.ClientApi.getInstance( ).compileApp( );
            }
            this.getModel( ).lastDatarow( ).compiling = true;
            break;

        case zz.ide.enums.Command.COMPILE_SOY:

            if( !this.getModel( ).lastDatarow( ).compilingSoy ){

                zz.ide.services.ClientApi.getInstance( ).compileSoy( );
            }
            this.getModel( ).lastDatarow( ).compiling = true;
            this.getModel( ).lastDatarow( ).compilingSoy = true;
            break;

        case zz.ide.enums.Command.COMPILE_STYLES:

            if( !this.getModel( ).lastDatarow( ).compilingStyles ){

                zz.ide.services.ClientApi.getInstance( ).compileStyles( );
            }
            this.getModel( ).lastDatarow( ).compiling = true;
            this.getModel( ).lastDatarow( ).compilingStyles = true;
            break;

        case zz.ide.enums.Command.COMPILE_MODELS:

            if( !this.getModel( ).lastDatarow( ).compilingModels ){

                zz.ide.services.ClientApi.getInstance( ).compileModels( );
            }
            this.getModel( ).lastDatarow( ).compiling = true;
            this.getModel( ).lastDatarow( ).compilingModels = true;
            break;

        case zz.ide.enums.Command.CALCDEPS:

            if( !this.getModel( ).lastDatarow( ).calculatingDeps ){

                zz.ide.services.ClientApi.getInstance( ).calculateDeps( );
            }
            this.getModel( ).lastDatarow( ).compiling = true;
            this.getModel( ).lastDatarow( ).calculatingDeps = true;
            break;
    }
};

/**
 *  Finish compiling
 *  @param {string} command
 */
zz.ide.controllers.Layout.prototype.finishCompiling = function( command ){

    switch( command ){

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
 *  Get popup controller
 *  @return {zz.ide.controllers.Popup}
 */
zz.ide.controllers.Layout.prototype.getPopupController = function( ){

    return zz.environment.services.MVCTree
    
        .getInstance( )
        .getNode(
            
            this.getModel( )

                .lastDatarow( )
                .popup
                .getUid( ) )

        .controller;
};

/**
 *  Get modal controller
 *  @return {zz.ide.controllers.Modal}
 */
zz.ide.controllers.Layout.prototype.getModalController = function( ){

    return zz.environment.services.MVCTree
        
        .getInstance( )
        .getNode(

            this.getModel( )

                .lastDatarow( )
                .modal
                .getUid( ) )

        .controller;
};

/**
 *  Get error controller
 *  @return {zz.ide.controllers.Error}
 */
zz.ide.controllers.Layout.prototype.getErrorController = function( ){

    return zz.environment.services.MVCTree
    
        .getInstance( )
        .getNode(
            
            this.getModel( )
    
                .lastDatarow( )
                .error
                .getUid( ) )
                
        .controller;
};