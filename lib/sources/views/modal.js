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

goog.provide( 'zz.ide.views.Modal' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.modal' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.ide.enums.CssClass' );

/**
 * Modal view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Modal = function( ){

    goog.base( this, zz.ide.templates.modal.default );
};
goog.inherits( zz.ide.views.Modal, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Modal );
zz.environment.services.MVCTree.registry.setView( 'modal', zz.ide.views.Modal );

/**
 * Set width and height for modal window.
 * @param {number} param_width
 * @param {number} param_height
 */
zz.ide.views.Modal.prototype.setSize = function( param_width, param_height ){

    var element = goog.dom.getElement( goog.getCssName( 'modal' ) );

    goog.style.setWidth( element, param_width );
    goog.style.setHeight( element, param_height );

    //goog.style.setStyle( element, min-height, param_height );
};

/**
 * Set position for modal window.
 * @param {number} param_top
 * @param {number} param_left
 */
zz.ide.views.Modal.prototype.setPosition = function( param_top, param_left ){

    var element = goog.dom.getElement( goog.getCssName( 'modal' ) );

    goog.style.setStyle( element, top, param_top );
    goog.style.setStyle( element, left, param_left );
};