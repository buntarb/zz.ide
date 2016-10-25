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

goog.provide( 'zz.ide.controllers.Application' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Application controller.
 * @param {zz.ide.models.Application} model
 * @param {zz.ide.views.Application} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Application = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Application, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'application', zz.ide.controllers.Application );

/**
 *  @override
 */
zz.ide.controllers.Application.prototype.setupListenersInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.Application.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( );
};

/**
 *  Open modal window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string=} opt_title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Application.prototype.openModal = function( showClose, showResize, height, width,

    opt_title, opt_top, opt_left ){

    this.getModel( ).lastDatarow( ).modal.createLast( [showClose, showResize, height, width,

        opt_title, opt_top, opt_left] );
};

/**
 *  Close modal window.
 */
zz.ide.controllers.Application.prototype.closeModal = function( ){

    this.getModel( ).lastDatarow( ).modal.deleteLast( );
};


/**
 *  Open error window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string} title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Application.prototype.openError = function( showClose, showResize, height, width,

                                                               title, opt_top, opt_left ){

    this.getModel( ).lastDatarow( ).error.createLast( [ showClose, showResize, height, width,

        title, opt_top, opt_left ] );
};

/**
 *  Close error window.
 */
zz.ide.controllers.Application.prototype.closeError = function( ){

    this.getModel( ).lastDatarow( ).error.deleteLast( );
};