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

goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.controllers.FEBase' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Header' );
goog.require( 'zz.ide.models.Header' );
goog.require( 'zz.ide.models.PopupSearchlist' );
goog.require( 'zz.ide.controllers.PopupSearchlist' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
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

};
goog.inherits( zz.ide.controllers.Header, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'header', zz.ide.controllers.Header );

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
        this.searchHandler_,
        false
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

        e.controller.getParent( ).getModel( ).lastDatarow( ).navigationIsShown =

            !e.controller.getParent( ).getModel( ).lastDatarow( ).navigationIsShown;

        e.stopPropagation( );
    }
};

/**
 * Focus event handler.
 * @param {zz.controllers.events.FOCUS} e
 * @private
 */
zz.ide.controllers.Header.prototype.focusSearchHandler_ = function( e ){

    this.getModel( ).lastDatarow( ).searchFocus = true;

    e.stopPropagation( );
};

/**
 * Blur event handler.
 * @param {zz.controllers.events.BLUR} e
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

    this.getView( ).setHeaderBackgroundColor_( route );
};


/**
 * Search input change event handler.
 * @param {zz.models.events.DatarowUpdate} e
 * @private
 */
zz.ide.controllers.Header.prototype.searchHandler_ = function( e ){

    var value = e.message.new_value;

    if( value !== false ){

        this.layout_.closePopup( );
    }

    if( value !== '' ){

        if( value !== true && value !== false ){

            value = value.replace( /\./g, '[.]' );
        }
        var regExp = new RegExp( value, 'g' );

        //var searchData = zz.ide.services.ClientApi.getInstance( ).getSearchData( );

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

            this.layout_.openPopup( undefined, 200, 200, 56, 150 );
            var popupSearchlistController = new zz.ide.controllers.PopupSearchlist( popupSearchlistModel );
            popupSearchlistController.render( goog.dom.getElement( zz.ide.enums.CssClass.POPUP ) );
        }
    }else{

        this.layout_.closePopup( );
    }

    e.stopPropagation( );
};