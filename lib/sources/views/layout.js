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

goog.provide( 'zz.ide.views.Layout' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.enums.DataAction' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.layout' );
goog.require( 'zz.environment.services.MVCTree' );
/**
 * Layout view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Layout = function( ){

    goog.base( this, zz.ide.templates.layout.default );
};
goog.inherits( zz.ide.views.Layout, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Layout );
zz.environment.services.MVCTree.registry.setView( 'layout', zz.ide.views.Layout );

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionAddBtn = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.ADD_BTN );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionCompileApp = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_APP );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionCompileSoy = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_SOY );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionCompileStyles = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_STYLES);
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionCompileModels = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_MODELS );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionCalculatingDeps = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CALCULATING_DEPS );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionBackBtn = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.BACK_BTN );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Layout.prototype.isActionForwardBtn = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.FORWARD_BTN );
};