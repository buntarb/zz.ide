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

goog.provide( 'zz.ide.controllers.Documentation' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.services.DocApi' );
goog.require( 'zz.ide.models.Documentation' );
goog.require( 'zz.ide.views.Documentation' );

/**
 * Documentation controller.
 * @param {zz.ide.models.Documentation} model
 * @param {zz.ide.views.Documentation} view
 * @param opt_dom
 * @constructor
 * @extend {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Documentation = function( model, view, opt_dom ){

    var model = new zz.ide.models.Documentation( );
    var view = zz.ide.views.Documentation.getInstance( );
    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Documentation, zz.ide.controllers.BaseViewController );

/**
 *  @override
 */
zz.ide.controllers.Documentation.prototype.setupListenersInternal = function( ){

    var data = zz.ide.services.DocApi.getInstance( ).getData( );
    this.getModel( ).createLast( data );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Documentation.prototype.actionHandler_ = function( e ){


};

