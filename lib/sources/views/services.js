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

goog.provide( 'zz.ide.views.Services' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.templates.services' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Services view.
 * @param {function} opt_model
 * @param {function} opt_dataset
 * @constructor
 * @extends {zz.views.FEBase}
 */
zz.ide.views.Services = function( opt_model, opt_dataset ){

    goog.base(
        this,
        opt_model ||
            zz.ide.templates.services.default,
        opt_dataset ||
            zz.ide.templates.services.dataset );
};
goog.inherits( zz.ide.views.Services, zz.views.FEBase );
zz.environment.services.MVCRegistry.setView( 'services', zz.ide.views.Services );
goog.addSingletonGetter( zz.ide.views.Services );

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Services.prototype.isActionStartSrv = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.START_SRV ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Services.prototype.isActionRunDev = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RUN_DEV ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Services.prototype.isActionRunDbg = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RUN_DBG ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Services.prototype.isActionRunApp = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RUN_APP ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Services.prototype.isActionRunUt = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RUN_UT ) > 0;
};