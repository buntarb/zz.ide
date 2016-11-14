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

goog.provide( 'zz.ide.views.ModalDeleteFile' );

goog.require( 'goog.dom' );

goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates.modaldeletefile' );
/**
 * ModalDeleteFile view.
 * @extends {zz.views.FEBase}
 * @constructor
 */
zz.ide.views.ModalDeleteFile = function( ){

    goog.base( this, zz.ide.templates.modaldeletefile.default );
};
goog.inherits( zz.ide.views.ModalDeleteFile, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.ModalDeleteFile );


/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.ModalDeleteFile.prototype.isActionCloseModal = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL ) > 0;
};

/**
 *
 * @param {zz.controllers.events.Action} e
 * @return {boolean}
 * @private
 */
zz.ide.views.ModalDeleteFile.prototype.isActionDelete = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.DELETE ) > 0;
};