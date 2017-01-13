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

goog.provide( 'zz.ide.views.Tabs' );

goog.require( 'goog.dom' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.templates.tabs' );
goog.require( 'zz.environment.services.MVCRegistry' );
/**
 * Navigation view.
 * @param {function} opt_model
 * @param {function} opt_dataset
 * @param {function} opt_datarow
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Tabs = function( opt_model, opt_dataset, opt_datarow ){

    goog.base(

        this,
        opt_model || zz.ide.templates.tabs.default,
        opt_dataset || zz.ide.templates.tabs.dataset,
        opt_datarow || zz.ide.templates.tabs.datarow
    );
};
goog.inherits( zz.ide.views.Tabs, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Tabs );
zz.environment.services.MVCRegistry.setView( 'tabs', zz.ide.views.Tabs );

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Tabs.prototype.isActionOpenItem = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.OPEN_LIST_ITEM ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Tabs.prototype.isActionRemoveItem = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.REMOVE_FROM_LIST ) > 0;
};
