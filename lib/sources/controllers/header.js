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

goog.provide( 'zz.ide.controllers.Header' );

goog.require( 'goog.dom' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Header' );
goog.require( 'zz.ide.models.Header' );
goog.require( 'zz.models.enums.EventType' );

/**
 * Header controller.
 * @param {zz.ide.models.Header} model
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Header = function( model, opt_dom ){

    /**
     * Header view.
     * @type {zz.ide.views.Header}
     */
    var view = zz.ide.views.Header.getInstance( );

    goog.base( this, model, view, opt_dom );

    this.getHandler( ).listen(

        this,
        goog.ui.Component.EventType.ACTION,
        this.actionHandler_,
        false
    );
};

goog.inherits( zz.ide.controllers.Header, zz.controllers.FEBase );

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Header.prototype.actionHandler_ = function( e ){

    console.log( "Header action", e );

    e.stopPropagation( );
};