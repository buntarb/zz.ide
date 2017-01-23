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

goog.provide( 'zz.ide.controllers.Tooltip' );

goog.require( 'zz.environment.services.MVCRegistry' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.views.Tooltip' );

/**
 * Tooltip controller.
 * @param {zz.ide.models.Tooltip} model
 * @param {zz.ide.views.Tooltip} view
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Tooltip = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Tooltip, zz.ide.controllers.BaseViewController );
zz.environment.services.MVCRegistry.setController( 'tooltip', zz.ide.controllers.Tooltip );

/**
 *  @override
 */
zz.ide.controllers.Tooltip.prototype.setupListenersInternal = function( ){

    this.getModel( ).createLast( );
};
