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
goog.require( 'goog.object' );
goog.require( 'goog.Timer' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.app.controllers.FELayoutController' );

goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.ModalApi' );
goog.require( 'zz.ide.services.PopupApi' );
goog.require( 'zz.ide.services.ConstantsConverter' );
goog.require( 'zz.ide.services.ViewStackApi' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.controllers.ModalAddFile' );

/**
 * Layout controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.app.controllers.FELayoutController}
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

    this.viewStackApi_ = zz.ide.services.ViewStackApi.getInstance( );

    this.prevFolderRoute_ = '';

    goog.base( this, model, view, opt_dom );
};
goog.inherits(
    zz.ide.controllers.Layout,
    zz.app.controllers.FELayoutController );

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

        this.router_,
        zz.environment.enums.EventType.ROUTED,
        this.routeChangedHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.LEAVE,
        this.leaveHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.ENTER,
        this.enterHandler_,
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
 * @override
 * @param {Function} viewCtrl
 */
zz.ide.controllers.Layout.prototype.setViewInternal = function( viewCtrl ){

    if( this.viewStackApi_.getCtrlFromViewStack( this.router_.getFragment( ) ) ){

        goog.dom.appendChild(

            this.getViewWrapper( ),
            this.viewStackApi_.getCtrlFromViewStack( this.router_.getFragment( ) ).getElement( )
        );
        this.viewStackApi_.getCtrlFromViewStack( this.router_.getFragment( ) ).updateRequest( );
        this.viewCtrl_ =  this.viewStackApi_.getCtrlFromViewStack( this.router_.getFragment( ) );

    }else{

        this.viewCtrl_ = new viewCtrl( );
        this.addChild( this.viewCtrl_, false );
        this.viewCtrl_.render( this.getViewWrapper( ) );

        this.viewStackApi_.pushToViewStack( this.router_.getFragment( ), this.getViewController( ) );
    }
};

/**
 * @override
 */
zz.ide.controllers.Layout.prototype.removeViewInternal = function( ){

    goog.dom.removeChildren( this.getViewWrapper( ) );
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
                .id === 'history-list' &&

            e.controller
                .getView( )
                .isActionShowHistory &&

            e.controller
                .getView( )
                .isActionShowHistory( e ) ){

            e.stopPropagation( );

        }
        if( !goog.dom.contains(

                zz.ide.services.PopupApi

                    .getInstance( )
                    .getPopupController( )
                    .getElement( ),
                e.elements[ 0 ] ) ){

            zz.ide.services.PopupApi

                .getInstance( )
                .closePopup( );
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

    }else if( this.getView( ).isActionShowNavBtn( e ) ){

        this.getModel( ).lastDatarow( ).navigationIsShown = !this.getModel( ).lastDatarow( ).navigationIsShown;

    }else if( this.getView( ).isActionBackToFolder( e ) ){

        this.router_.setFragment( this.prevFolderRoute_ );

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
zz.ide.controllers.Layout.prototype.enterHandler_ = function( e ){

    console.log( 'enter', e );

    goog.dom.classlist.add( e.elements[ 0 ], zz.ide.enums.CssClass.HOVER );
    goog.dom.classlist.add( goog.dom.getParentElement( e.elements[ 0 ] ), zz.ide.enums.CssClass.HOVER );
    goog.dom.classlist.remove( e.elements[ 0 ], zz.ide.enums.CssClass.BLUR );

    e.stopPropagation( );
};

/**
 * Mouse leave event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Layout.prototype.leaveHandler_ = function( e ){

    console.log( 'leave', e );

    goog.dom.classlist.remove( e.elements[ 0 ], zz.ide.enums.CssClass.HOVER );
    goog.dom.classlist.add( e.elements[ 0 ], zz.ide.enums.CssClass.BLUR );
    goog.dom.classlist.remove( goog.dom.getParentElement( e.elements[ 0 ] ), zz.ide.enums.CssClass.HOVER );
    goog.Timer.callOnce(

        function( ){

            goog.dom.classlist.remove( e.elements[ 0 ], zz.ide.enums.CssClass.BLUR );
        },
        400
    );

    e.stopPropagation( );
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
        this.getModel( ).lastDatarow( ).serverServicesIsShown = true;

        if( opt_e ){

            if( !goog.dom.pattern.matchStringOrRegex( /file=/g, opt_e.getPrevFragment( ) ) ){

                this.getModel( ).lastDatarow( ).navigationIsShown = false;
                this.prevFolderRoute_ = opt_e.getPrevFragment( );
            }
        }else{

            this.getModel( ).lastDatarow( ).navigationIsShown = false;
        }


    }else{

        this.getModel( ).lastDatarow( ).addBtnShow = true;
        this.getModel( ).lastDatarow( ).headerIsShown = true;
        this.getModel( ).lastDatarow( ).serverServicesIsShown = false;
        this.getModel( ).lastDatarow( ).navigationIsShown = true;
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
 * Open modal addfile window.
 */
zz.ide.controllers.Layout.prototype.openModalAddFile = function( ){

    if( !zz.ide.services.ModalApi

            .getInstance( )
            .getModalModel( )
            .length ){

        zz.ide.services.ModalApi

            .getInstance( )
            .openModal(

            'addfile',
            '',
            true,
            false,
            215,
            380,
            goog.dom.getViewportSize( ).height/2 - 107,
            goog.dom.getViewportSize( ).width/2 - 190 );

        zz.ide.services.ModalApi

            .getInstance( )
            .getModalController( )
        
            .renderChildController(
    
                new zz.ide.controllers.ModalAddFile(
                    
                    zz.ide.services.ConstantsConverter
            
                        .getInstance( )
                        .getPathFromRoute( this.router_.getFragment( ) ) ),
                
                goog.dom.getElementByClass( zz.ide.enums.CssClass.MODAL_BODY ) );
    }
};

/**
 *  Get header controller
 *  @return {zz.ide.controllers.Header}
 */
zz.ide.controllers.Layout.prototype.getHeaderController = function( ){

    return zz.environment.services.MVCRegistry

        .getInstance( )
        .get(

            this.getModel( )

                .lastDatarow( )
                .header
                .getUid( ) )

        .controller;
};

/**
 *  Get view controller.
 *  @return {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Layout.prototype.getViewCtrl = function( ){

    return this.viewCtrl_;
};

/**
 *  Set compile status.
 *  @param {boolean} flag
 */
zz.ide.controllers.Layout.prototype.setCompilingStatus = function( flag ){

    this.getModel( ).lastDatarow( ).compiling = flag;
};
