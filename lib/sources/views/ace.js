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

goog.provide( 'zz.ide.views.Ace' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.ace' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Ace view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.Ace = function( ){

    goog.base( this, zz.ide.templates.ace.default );
};
goog.inherits( zz.ide.views.Ace, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Ace );
zz.environment.services.MVCRegistry.setView( 'ace', zz.ide.views.Ace );

/**
 * Set height for Ace.
 * @param {number} param_height
 */
zz.ide.views.Ace.prototype.setHeight = function( param_height ){

    var element = goog.dom.getElement( zz.ide.enums.CssClass.ACE_EDITOR );
    goog.style.setHeight( element, param_height );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Ace.prototype.isActionShowHistory = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SHOW_HISTORY ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Ace.prototype.isActionSaveFile = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SAVE_FILE ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Ace.prototype.isActionFindInFile = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.FIND_IN_FILE ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Ace.prototype.isActionReplaceInFile = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.REPLACE_IN_FILE ) > 0;
};