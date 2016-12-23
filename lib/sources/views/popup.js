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

goog.provide( 'zz.ide.views.Popup' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.popup' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.DataAction' );

/**
 * Popup view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Popup = function( ){

    goog.base( this, zz.ide.templates.popup.default );
};
goog.inherits( zz.ide.views.Popup, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Popup );
zz.environment.services.MVCRegistry.setView( 'popup', zz.ide.views.Popup );

/**
 * Set width and height for Popup window.
 * @param {number} param_width
 * @param {number} param_height
 */
zz.ide.views.Popup.prototype.setSize = function( param_width, param_height ){

    var element = goog.dom.getElement( goog.getCssName( 'popup' ) );

    goog.style.setWidth( element, param_width );
    goog.style.setHeight( element, param_height );
};

/**
 * Set position for Popup window.
 * @param {number} param_top
 * @param {number} param_left
 */
zz.ide.views.Popup.prototype.setPosition = function( param_top, param_left ){

    var element = goog.dom.getElement( goog.getCssName( 'popup' ) );

    goog.style.setPosition( element, param_left, param_top );
};


/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Popup.prototype.isActionClosePopup = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL ) > 0;
};