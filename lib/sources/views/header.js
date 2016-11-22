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

goog.provide( 'zz.ide.views.Header' );

goog.require( 'goog.dom' );
goog.require( 'goog.dom.pattern' );
goog.require( 'goog.dom.classlist' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.templates.header' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.environment.services.MVCTree' );
/**
 * Header view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Header = function( ){

    goog.base( this, zz.ide.templates.header.default );
};
goog.inherits( zz.ide.views.Header, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Header );
zz.environment.services.MVCTree.registry.setView( 'header', zz.ide.views.Header );

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Header.prototype.isActionShowNavigation = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SHOW_NAVIGATION ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Header.prototype.isActionServicesBtn = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SERVICES_BTN ) > 0;
};

/**
 * Set header background color.
 * @param {string} route
 */
zz.ide.views.Header.prototype.setHeaderBackgroundColor_ = function( route ){

    var element = goog.dom.getElementByClass( zz.ide.enums.CssClass.HEADER );
    if( goog.dom.pattern.matchStringOrRegex( /\/models/, route ) ){

        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.ORANGE );
        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.GREEN );

        goog.dom.classlist.add( element, zz.ide.enums.CssClass.BLUE );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/templates/, route ) ) {

        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.BLUE );
        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.GREEN );

        goog.dom.classlist.add( element, zz.ide.enums.CssClass.ORANGE );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/styles/, route ) ){

        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.ORANGE );
        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.BLUE );

        goog.dom.classlist.add( element, zz.ide.enums.CssClass.GREEN );

    }else{

        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.ORANGE );
        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.GREEN );
        goog.dom.classlist.remove( element, zz.ide.enums.CssClass.BLUE );
    }
};
