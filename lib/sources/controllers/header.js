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

goog.provide( 'zz.ide.controllers.Header' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.pattern' );
goog.require( 'goog.json' );
goog.require( 'goog.array' );

goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.controllers.FEBase' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.Command' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.SearchApi' );
goog.require( 'zz.ide.services.DocApi' );
goog.require( 'zz.ide.services.ModalApi' );
goog.require( 'zz.ide.services.PopupApi' );

goog.require( 'zz.ide.views.Header' );
goog.require( 'zz.ide.models.Header' );
goog.require( 'zz.ide.models.PopupSearchlist' );
goog.require( 'zz.ide.models.JSDocQuery' );
goog.require( 'zz.ide.controllers.PopupSearchlist' );
goog.require( 'zz.ide.controllers.Documentation' );
goog.require( 'zz.ide.views.Documentation' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Header controller.
 * @param {zz.ide.models.Header} model
 * @param {zz.ide.views.Header} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Header = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );

    this.layout_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( );

    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );
};
goog.inherits( zz.ide.controllers.Header, zz.controllers.FEBase );
zz.environment.services.MVCRegistry.setController( 'header', zz.ide.controllers.Header );

/**
 *  @override
 */
zz.ide.controllers.Header.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.FOCUS,
        this.focusSearchHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this,
        zz.controllers.enums.EventType.BLUR,
        this.blurSearchHandler_,
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
    this.getHandler( ).listen(

        this.getModel( ),
        zz.models.enums.EventType.DATAROW_UPDATE,
        this.searchQueryHandler_,
        false
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.JSDOC_KEYWORDS,
        this.keywordsResponseHandler_,
        false,
        this
    );
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.JSDOC_DEFINITIONS,
        this.definitionsResponseHandler_,
        false,
        this
    );
};

/**
 *  @override
 */
zz.ide.controllers.Header.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( ['menu'] );
    this.routeChangedHandler_( );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Header.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionShowNavigation( e ) ){

        e.controller
        
            .getParent( )
            .getModel( )
            .lastDatarow( )
            .navigationIsShown =

            !e.controller
            
                .getParent( )
                .getModel( )
                .lastDatarow( )
                .navigationIsShown;

    }
    e.stopPropagation( );
};

/**
 * Focus event handler.
 * @param {zz.controllers.events.Focus} e
 * @private
 */
zz.ide.controllers.Header.prototype.focusSearchHandler_ = function( e ){

    this.getModel( ).lastDatarow( ).searchFocus = true;
    e.stopPropagation( );
};

/**
 * Blur event handler.
 * @param {zz.controllers.events.Blur} e
 * @private
 */
zz.ide.controllers.Header.prototype.blurSearchHandler_ = function( e ){

    this.getModel( ).lastDatarow( ).searchFocus = false;
    e.stopPropagation( );
};

/**
 * Route changed handler.
 * @param {zz.environment.events.Routed=} opt_e
 */
zz.ide.controllers.Header.prototype.routeChangedHandler_ = function( opt_e ){

    var route;
    if( opt_e ){

        route = opt_e.getCurrFragment( );

    }else{

        route = this.router_.getFragment( );
    }
    //this.getView( ).setHeaderMenuIcon_( route );
};

/**
 * Search input change event handler.
 * @param {zz.models.events.DatarowUpdate} e
 * @private
 */
zz.ide.controllers.Header.prototype.searchQueryHandler_ = function( e ){

    if( e.message.datafield === this.getModel( ).datafield.search ){

        if( zz.ide.services.PopupApi

                .getInstance( )
                .getPopupController( ).getChildCount( ) === 1 ){
            
            var listModel = zz.ide.services.PopupApi

                .getInstance( )
                .getPopupController( )
                .getChildAt( 0 )
                .getModel( );
                
            if( listModel.firstDatarow( ) ){
                
                while( listModel.deleteCurrent( ) ){}
            }
        }
        if( e.message.new_value !== '' ){

            zz.ide.services.SearchApi
            
                .getInstance( )
                .askKeywords( e.message.new_value );
        }
    }
    e.stopPropagation( );
};


/**
 * Search response event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Header.prototype.keywordsResponseHandler_ = function( e ){

    var listCtrl;
    var listModel;
    var searchDataMessageModel =
        new zz.ide.models.JSDocQuery( undefined, e.getDataJson( ) );
        
    var searchData =
        goog.json.parse( searchDataMessageModel.lastDatarow( ).result );
    
    if( zz.ide.services.PopupApi

            .getInstance( )
            .getPopupController( ).getChildCount( ) === 1 ){
        
        listCtrl = zz.ide.services.PopupApi

            .getInstance( )
            .getPopupController( )
            .getChildAt( 0 );
            
        listModel = listCtrl.getModel( );
    
    }else{
        
        listModel = new zz.ide.models.PopupSearchlist( );
        listCtrl = new zz.ide.controllers.PopupSearchlist( listModel );
        
        if( searchData.length ){

            zz.ide.services.PopupApi

                .getInstance( )
                .openPopup(
        
                'search',
                undefined,
                undefined,
                470,
                goog.style.getSize( this.getElement( ) ).height,
                goog.dom.getViewportSize( ).width/2 - 235
            );
            zz.ide.services.PopupApi

                .getInstance( )
                .renderChildController( listCtrl );
        }
    }
    goog.array.forEach( searchData, function( searchItem ){

        listModel.createLast( [ searchItem ] );
    } );
    e.stopPropagation( );
};

/**
 * Search response event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Header.prototype.definitionsResponseHandler_ = function( e ){

    var documentationDataMessageModel =
        new zz.ide.models.JSDocQuery( undefined, e.getDataJson( ) );
        
    var documentationData =
        goog.json.parse( documentationDataMessageModel.lastDatarow( ).result );

    var modalWidth = goog.dom.getViewportSize( ).width - 436;
    var modalHeight = 215;
    var modalLeft = ( goog.dom.getViewportSize( ).width - modalWidth )/2;
    var modalTop = goog.dom.getViewportSize( ).height/2 - 107;

    zz.ide.services.ModalApi

        .getInstance( )
        .closeModal( );

    if( documentationData.length ){

        zz.ide.services.ModalApi

            .getInstance( )
            .openModal(

            'documentation',
            '',
            true,
            false,
            modalHeight,
            modalWidth,
            modalTop,
            modalLeft
        );
        var documentationModel = zz.ide.services.DocApi
        
            .getInstance( )
            .getDocumentationModel( documentationData );

        var documentationView = zz.ide.views.Documentation.getInstance( );
        /**
         * Modal window for documentation.
         * @type {zz.ide.controllers.Documentation}
         */
        var documentationController =

            new zz.ide.controllers.Documentation(

                documentationModel,
                documentationView,
                zz.ide.views.Documentation.getInstance( ) );

        zz.ide.services.ModalApi

            .getInstance( )
            .renderChildController( documentationController );
    }
    e.stopPropagation( );
};

/**
 * Set folder title.
 * @param {string} title
 */
zz.ide.controllers.Header.prototype.setFolderTitle = function( title ){

    this.getModel( ).lastDatarow( ).folderTitle = title;
};