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

goog.provide( 'zz.ide.services.ModalApi' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.ModalApi = function( ){

    goog.base( this, 'zz.ide.services.ModalApi' );

    this.model_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( )
        .getModel( )
        .lastDatarow( )
        .modal;
};

goog.inherits( zz.ide.services.ModalApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ModalApi );

/**
 *  Open modal window.
 *  @param {string=} opt_id
 *  @param {string=} opt_title
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 *  @param {string=} opt_icon
 */
zz.ide.services.ModalApi.prototype.openModal = function(

    opt_id,
    opt_title,
    showClose,
    showResize,
    height,
    width,
    opt_top,
    opt_left,
    opt_icon){

    this.model_.createLast( [

            opt_id,
            opt_title,
            showClose,
            showResize,
            height,
            width,
            opt_top,
            opt_left,
            opt_icon
        ] );
};

/**
 *  Close modal window.
 */
zz.ide.services.ModalApi.prototype.closeModal = function( ){

    for( var i = 0; i < this.getModalController( ).getChildCount( ); i++ ){

        this.getModalController( ).getChildAt( i ).dispose( );
    }
    this.model_.deleteLast( );
};


/**
 *  Get modal controller
 *  @return {zz.ide.controllers.Modal}
 */
zz.ide.services.ModalApi.prototype.getModalController = function( ){

    return zz.environment.services.MVCRegistry

        .getInstance( )
        .get( this.model_.getUid( ) )
        .controller;
};

/**
 *  Get modal model.
 *  @return {zz.models.Dataset}
 */
zz.ide.services.ModalApi.prototype.getModalModel = function( ){

    return this.model_;
};


/**
 *  Set icon
 *  @param {string} icon
 */
zz.ide.services.ModalApi.prototype.setIcon = function( icon ){

    this.model_.lastDatarow( ).icon = icon;
};