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

goog.provide( 'zz.ide.services.PopupApi' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.PopupApi = function( ){

    goog.base( this, 'zz.ide.services.PopupApi' );

    this.model_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( )
        .getModel( )
        .lastDatarow( )
        .popup;
};

goog.inherits( zz.ide.services.PopupApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.PopupApi );

/**
 *  Open popup window.
 *  @param {string} id
 *  @param {string} title
 *  @param {number} height
 *  @param {number} width
 *  @param {number} top
 *  @param {number} left
 */
zz.ide.services.PopupApi.prototype.openPopup = function(

    id,
    title,
    height,
    width,
    top,
    left ){

    while( this.model_.deleteLast( ) ){}
    this.model_.createLast( [

            id,
            title,
            height,
            width,
            top,
            left
        ] );
};

/**
 *  Close popup window.
 */
zz.ide.services.PopupApi.prototype.closePopup = function( ){

    for( var i = 0; i < this.getPopupController( ).getChildCount( ); i++ ){

        this.getPopupController( ).getChildAt( i ).dispose( );
    }
    this.model_.deleteLast( );
};

/**
 *  Get popup controller
 *  @return {zz.ide.controllers.Error}
 */
zz.ide.services.PopupApi.prototype.getPopupController = function( ){

    return zz.environment.services.MVCRegistry

        .getInstance( )
        .get( this.model_.getUid( ) )
        .controller;
};

/**
 *  Get popup model.
 *  @return {zz.models.Dataset}
 */
zz.ide.services.PopupApi.prototype.getPopupModel = function( ){

    return this.model_;
};

/**
 *  Render child controller to modal window.
 *  @param {zz.ide.controllers.BaseViewController} controller
 */
zz.ide.services.PopupApi.prototype.renderChildController = function( controller ){

    this.getPopupController( ).renderChildController(

        controller,
        goog.dom.getElementByClass( zz.ide.enums.CssClass.POPUP )
    );
};

