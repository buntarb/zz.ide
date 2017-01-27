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

goog.provide( 'zz.ide.controllers.ModalError' );


goog.require( 'zz.ide.views.ModalError' );
goog.require( 'zz.ide.models.ModalError' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.environment.services.Environment' );

/**
 * ModalError controller.
 * @param {string} text
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.ModalError = function( text, opt_dom ){

    /**
     * @type {zz.ide.models.ModalError}
     */
    var model = new zz.ide.models.ModalError( );

    model.createLast( [text] );

    /**
     * @type {zz.ide.views.ModalError}
     */
    var view = zz.ide.views.ModalError.getInstance( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.ModalError, zz.ide.controllers.BaseViewController );

/**
 *  @override
 */
zz.ide.controllers.ModalError.prototype.setupListenersInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.ModalError.prototype.bootstrap = function( ){

    var parent = this.getParent( );
    parent.getView( ).setSize( parent.getModel( ).lastDatarow( ).width, parent.getModel( ).lastDatarow( ).height );
    parent.getView( ).setPosition( parent.getModel( ).lastDatarow( ).top, parent.getModel( ).lastDatarow( ).left );
};