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

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.app.controllers.FELayoutController' );

goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.ConstantsConverter' );
goog.require( 'zz.ide.services.HashViewApi' );
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

    this.hashView_ = [];
    
    goog.base( this, model, view, opt_dom );

    this.hashViewApi_ = zz.ide.services.HashViewApi.getInstance( );
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

    if( this.hashViewApi_.getCtrlFromHashView( this.router_.getFragment( ) ) ){

        goog.dom.appendChild(

            this.getViewWrapper( ),
            this.hashViewApi_.getCtrlFromHashView( this.router_.getFragment( ) ).getElement( )
        );
        this.hashViewApi_.getCtrlFromHashView( this.router_.getFragment( ) ).updateRequest( );
        this.viewCtrl_ =  this.hashViewApi_.getCtrlFromHashView( this.router_.getFragment( ) );

    }else{

        this.viewCtrl_ = new viewCtrl( );
        this.addChild( this.viewCtrl_, false );
        this.viewCtrl_.render( this.getViewWrapper( ) );

        this.hashView_[ this.hashView_.length ] = {

            'route': this.router_.getFragment( ),
            'controller': this.getViewController( )
        };
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

    }else if( this.getView( ).isActionShowNavBtn( e ) ){

        this.getModel( ).lastDatarow( ).navigationIsShown = !this.getModel( ).lastDatarow( ).navigationIsShown;

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
        this.getModel( ).lastDatarow( ).navigationIsShown = false;
        this.getModel( ).lastDatarow( ).serverServicesIsShown = true;

    }else{

        this.getModel( ).lastDatarow( ).addBtnShow = true;
        this.getModel( ).lastDatarow( ).headerIsShown = true;
        this.getModel( ).lastDatarow( ).navigationIsShown = true;
        this.getModel( ).lastDatarow( ).serverServicesIsShown = false;
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
 *  @param {string=} opt_title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 *  @param {string=} opt_text
 */
zz.ide.controllers.Layout.prototype.openError = function(

    showClose,
    showResize,
    height,
    width,
    opt_title,
    opt_top,
    opt_left,
    opt_text){

    this.getModel( )

        .lastDatarow( )
        .error
        .createLast( [

            showClose,
            showResize,
            height,
            width,
            opt_title,
            opt_top,
            opt_left,
            opt_text
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
                    
                    zz.ide.services.ConstantsConverter
            
                        .getInstance( )
                        .getPathFromRoute( this.router_.getFragment( ) ) ),
                
                goog.dom.getElementByClass( zz.ide.enums.CssClass.MODAL_BODY ) );
    }
};

/**
 *  Get popup controller
 *  @return {zz.ide.controllers.Popup}
 */
zz.ide.controllers.Layout.prototype.getPopupController = function( ){

    return zz.environment.services.MVCRegistry
    
        .getInstance( )
        .get(
            
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

    return zz.environment.services.MVCRegistry
        
        .getInstance( )
        .get(

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

    return zz.environment.services.MVCRegistry
    
        .getInstance( )
        .get(
            
            this.getModel( )
    
                .lastDatarow( )
                .error
                .getUid( ) )
                
        .controller;
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

/**
 *  Get hash of view controllers
 *  @return {Array}
 */
zz.ide.controllers.Layout.prototype.getHashView = function( ){

    return this.hashView_;
};

/**
 *  Push element to the hashView
 *  @param {string} route
 *  @param {zz.ide.controllers.Ace} controller
 */
zz.ide.controllers.Layout.prototype.pushToHashView = function( route, controller ){

    this.hashView_[ this.hashView_.length ] = {

        'route': route,
        'controller': controller
    }
};
