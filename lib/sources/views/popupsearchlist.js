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

goog.provide( 'zz.ide.views.PopupSearchlist' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.templates.popupsearchlist' );
goog.require( 'zz.views.FEBase' );

/**
 * PopupSearchlist view.
 * @constructor
 * @extends {zz.views.FEBase}
 */
zz.ide.views.PopupSearchlist = function( ){

    goog.base( this, zz.ide.templates.popupsearchlist.default, zz.ide.templates.popupsearchlist.dataset );
};
goog.inherits( zz.ide.views.PopupSearchlist, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.PopupSearchlist );

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.PopupSearchlist.prototype.isActionOpenItem = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.OPEN_LIST_ITEM ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.PopupSearchlist.prototype.isActionRemoveItem = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.REMOVE_FROM_LIST ) > 0;
};
