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

goog.provide( 'zz.ide.views.Error' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.error' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.ide.enums.CssClass' );

/**
 * Error view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Error = function( ){

    goog.base( this, zz.ide.templates.error.default );
};
goog.inherits( zz.ide.views.Error, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Error );
zz.environment.services.MVCTree.registry.setView( 'error', zz.ide.views.Error );

/**
 * Set width and height for Error window.
 * @param {number} width
 * @param {number} height
 */
zz.ide.views.Error.prototype.setSize = function( width, height ){

    var element = goog.dom.getElement( goog.getCssName( 'error' ) );

    goog.style.setWidth( element, width );
    goog.style.setHeight( element, height );
};

/**
 * Set position for error window.
 * @param {number} param_top
 * @param {number} param_left
 */
zz.ide.views.Error.prototype.setSize = function( param_top, param_left ){

    var element = goog.dom.getElement( goog.getCssName( 'error' ) );

    goog.style.setStyle( element, top, param_top );
    goog.style.setStyle( element, left, param_left );
};