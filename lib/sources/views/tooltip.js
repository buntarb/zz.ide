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

goog.provide( 'zz.ide.views.Tooltip' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );
goog.require( 'goog.dom.classlist' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.tooltip' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Tooltip view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Tooltip = function( ){

    goog.base( this, zz.ide.templates.tooltip.default );
};
goog.inherits( zz.ide.views.Tooltip, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Tooltip );
zz.environment.services.MVCRegistry.setView( 'tooltip', zz.ide.views.Tooltip );


/**
 * Set position for Tooltip window.
 * @param {number} param_top
 * @param {number} param_left
 */
zz.ide.views.Tooltip.prototype.setPosition = function( param_top, param_left ){

    var element = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );

    goog.style.setPosition( element, param_left, param_top );

    goog.dom.classlist.add( element, zz.ide.enums.CssClass.SHOW );
};

/**
 * Set width and height for tooltip window.
 * @param {number} param_width
 * @param {number} param_height
 */
zz.ide.views.Tooltip.prototype.setSize = function( param_width, param_height ){

    var element = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );

    goog.style.setWidth( element, param_width );
    goog.style.setHeight( element, param_height );
};