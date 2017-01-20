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

goog.provide( 'zz.ide.services.ErrorApi' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.ErrorApi = function( ){

    goog.base( this, 'zz.ide.services.ErrorApi' );

    this.model_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( )
        .getModel( )
        .lastDatarow( )
        .error;
};

goog.inherits( zz.ide.services.ErrorApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ErrorApi );

/**
 *  Open error window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string=} opt_title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 *  @param {string=} opt_text
 */
zz.ide.services.ErrorApi.prototype.openError = function(

    showClose,
    showResize,
    height,
    width,
    opt_title,
    opt_top,
    opt_left,
    opt_text){

    this.model_

        .createLast( [

            showClose,
            showResize,
            height,
            width,
            opt_title,
            opt_top,
            opt_left,
            opt_text
        ] );
};

/**
 *  Close error window.
 */
zz.ide.services.ErrorApi.prototype.closeError = function( ){

    for( var i = 0; i < this.getErrorController( ).getChildCount( ); i++ ){

        this.getErrorController( ).getChildAt( i ).dispose( );
    }
    this.model_.deleteLast( );
};

/**
 *  Get error controller
 *  @return {zz.ide.controllers.Error}
 */
zz.ide.services.ErrorApi.prototype.getErrorController = function( ){

    return zz.environment.services.MVCRegistry

        .getInstance( )
        .get( this.model_.getUid( ) )
        .controller;
};

/**
 *  Get error model.
 *  @return {zz.models.Dataset}
 */
zz.ide.services.ErrorApi.prototype.getErrorModel = function( ){

    return this.model_;
};

