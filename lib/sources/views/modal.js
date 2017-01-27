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
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.DataAction' );

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
zz.environment.services.MVCRegistry.setView( 'modal', zz.ide.views.Modal );

/**
 * Set width and height for modal window.
 * @param {number} param_width
 * @param {number} param_height
 */
zz.ide.views.Modal.prototype.setSize = function( param_width, param_height ){

    var parents = goog.dom.getElementsByClass( zz.ide.enums.CssClass.MODAL );
    var parenElement =  parents[ 1 ] ? parents[ 1 ] : parents[ 0 ];
    goog.style.setWidth( parenElement, param_width );
    goog.style.setHeight( parenElement, param_height );
};

/**
 * Set position for modal window.
 * @param {number} param_top
 * @param {number} param_left
 */
zz.ide.views.Modal.prototype.setPosition = function( param_top, param_left ){

    var parents = goog.dom.getElementsByClass( zz.ide.enums.CssClass.MODAL );
    var parenElement =  parents[ 1 ] ? parents[ 1 ] : parents[ 0 ];

    goog.style.setPosition( parenElement, param_left, param_top );
};


/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Modal.prototype.isActionCloseModal = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Modal.prototype.isActionResizeModal = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RESIZE_MODAL ) > 0;
};