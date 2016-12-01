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

goog.provide( 'zz.ide.controllers.DocumentationValue' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Documentation value controller.
 * @param {zz.ide.models.DocumentationValue} model
 * @param {zz.ide.views.DocumentationValue} view
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.DocumentationValue = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.DocumentationValue, zz.ide.controllers.BaseViewController );
zz.environment.services.MVCTree
    .registry
    .setController( 'documentationValue', zz.ide.controllers.DocumentationValue );

/**
 *  @override
 */
zz.ide.controllers.DocumentationValue.prototype.setupListenersInternal = function( ){

};

/**
 *  @override
 */
zz.ide.controllers.DocumentationValue.prototype.bootstrap = function( ){

};
/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.DocumentationValue.prototype.actionHandler_ = function( e ){


};

