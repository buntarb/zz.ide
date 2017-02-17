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

goog.provide( 'zz.ide.controllers.Search' );

goog.require( 'goog.dom' );

goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.controllers.FEBase' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.ide.enums.CssClass' );

goog.require( 'zz.ide.services.SearchApi' );
goog.require( 'zz.ide.services.PopupApi' );
goog.require( 'zz.ide.services.DocApi' );

goog.require( 'zz.ide.views.Search' );
goog.require( 'zz.ide.models.Search' );
goog.require( 'zz.ide.models.PopupSearchlist' );
goog.require( 'zz.ide.models.JSDocQuery' );
goog.require( 'zz.ide.controllers.PopupSearchlist' );
goog.require( 'zz.ide.controllers.Documentation' );
goog.require( 'zz.ide.views.Documentation' );
goog.require( 'zz.ide.views.DocumentationNotSupported' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Search controller.
 * @param {zz.ide.models.Search} model
 * @param {zz.ide.views.Search} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Search = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.layout_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( );

    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );
};
goog.inherits( zz.ide.controllers.Search, zz.controllers.FEBase );
zz.environment.services.MVCRegistry.setController( 'search', zz.ide.controllers.Search );

/**
 *  @override
 */
zz.ide.controllers.Search.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.Search.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( );
};


/**
 *  @override
 */
zz.ide.controllers.Search.prototype.bootstrap = function( ){


};

///**
// * Focus event handler.
// * @param {zz.controllers.events.Focus} e
// * @private
// */
//zz.ide.controllers.Search.prototype.focusSearchHandler_ = function( e ){
//
//    this.getModel( ).lastDatarow( ).focus = true;
//    e.stopPropagation( );
//};
//
///**
// * Blur event handler.
// * @param {zz.controllers.events.Blur} e
// * @private
// */
//zz.ide.controllers.Search.prototype.blurSearchHandler_ = function( e ){
//
//    this.getModel( ).lastDatarow( ).focus = false;
//    e.stopPropagation( );
//};


/**
 * Search input change event handler.
 * @param {zz.models.events.DatarowUpdate} e
 * @private
 */
zz.ide.controllers.Search.prototype.searchQueryHandler_ = function( e ){

    if( e.message.datafield === this.getModel( ).datafield.input ){

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
zz.ide.controllers.Search.prototype.keywordsResponseHandler_ = function( e ){

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

                    'searchlist',
                    undefined,
                    undefined,
                    250,
                    this.getElement( ).getBoundingClientRect( ).bottom + 16,
                    this.getElement( ).getBoundingClientRect( ).left - 10,
                    zz.ide.enums.CssClass.FIXED
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
zz.ide.controllers.Search.prototype.definitionsResponseHandler_ = function( e ){

    var searchElement = goog.dom.getElementByClass( zz.ide.enums.CssClass.LAYOUT_SEARCH_WRAPPER);
    goog.dom.classlist.remove( searchElement, zz.ide.enums.CssClass.OPEN );
    this.getModel( ).lastDatarow( ).input = '';

    var documentationDataMessageModel =
        new zz.ide.models.JSDocQuery( undefined, e.getDataJson( ) );

    var documentationData =
        goog.json.parse( documentationDataMessageModel.lastDatarow( ).result );

    var search = documentationDataMessageModel.lastDatarow( ).search;

    if( goog.DEBUG ){

        console.log( search, documentationData );
    }

    var viewWrapperElement = goog.dom.getElement( zz.ide.enums.CssClass.VIEW_WRAPPER );
    var modalWidth = goog.style.getSize( viewWrapperElement ).width - 40;
    var modalHeight = goog.dom.getViewportSize( ).height - 110;
    var modalTop = 90;
    var modalLeft = goog.style.getPosition( viewWrapperElement).x + 20;

    zz.ide.services.ModalApi

        .getInstance( )
        .closeModal( );

    if( documentationData.length ){

        zz.ide.services.ModalApi

            .getInstance( )
            .openModal(

            'documentation',
            'Documentation',
            true,
            false,
            modalHeight,
            modalWidth,
            modalTop,
            modalLeft,
            '',
            zz.ide.enums.CssClass.MODAL_DOC
        );

        var documentationObj = zz.ide.services.DocApi

            .getInstance( )
            .getDocumentationModel( documentationData, search );

        var documentationModel = documentationObj.model;

        var isSupported = documentationObj.isSupported;

        var documentationView;

        if( isSupported ){

            documentationView = zz.ide.views.Documentation.getInstance( );

        }else{

            documentationView = zz.ide.views.DocumentationNotSupported.getInstance( );
        }

        var documentationController  =

            new zz.ide.controllers.Documentation(

                documentationModel,
                documentationView );

        zz.ide.services.ModalApi

            .getInstance( )
            .renderChildController( documentationController );
    }
    e.stopPropagation( );
};