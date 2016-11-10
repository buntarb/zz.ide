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

goog.provide( 'zz.ide.views.Filelist' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.templates.filelist' );
goog.require( 'zz.views.FEBase' );
/**
 * Filelist view.
 * @constructor
 * @extends {zz.views.FEBase}
 */
zz.ide.views.Filelist = function( ){

    goog.base( this, zz.ide.templates.filelist.default );
};
goog.inherits( zz.ide.views.Filelist, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Filelist );

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Filelist.prototype.isActionOpen = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.OPEN );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Filelist.prototype.isActionCopy = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COPY );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Filelist.prototype.isActionRename = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RENAME );
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.Filelist.prototype.isActionDelete = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SHOW_DELETE_FILE_MODAL );
};