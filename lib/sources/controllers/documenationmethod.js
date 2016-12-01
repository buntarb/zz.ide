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

goog.provide( 'zz.ide.controllers.DocumentationMethod' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Documentation controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.DocumentationMethod = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};
goog.inherits(
    zz.ide.controllers.DocumentationMethod,
    zz.ide.controllers.BaseViewController );
    
zz.environment.services.MVCTree
    .registry
    .setController(
        'documentationMethod',
        zz.ide.controllers.DocumentationMethod );

/**
 *  @override
 */
zz.ide.controllers.DocumentationMethod.prototype.setupListenersInternal = function( ){

};

/**
 *  @override
 */
zz.ide.controllers.DocumentationMethod.prototype.bootstrap = function( ){

};
/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.DocumentationMethod.prototype.actionHandler_ = function( e ){


};
