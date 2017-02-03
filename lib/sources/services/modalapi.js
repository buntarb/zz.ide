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

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.controllers.ModalError' );

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
 *  @param {string=} opt_className
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
    opt_icon,
    opt_className){

    if( opt_id !== zz.ide.enums.CssClass.MODAL_ERROR ){

        this.closeModal( );
    }
    //this.model_.createLast( [
    //
    //        opt_id,
    //        opt_title,
    //        showClose,
    //        showResize,
    //        height,
    //        width,
    //        opt_top,
    //        opt_left,
    //        opt_icon,
    //        opt_className
    //    ] );

    this.model_.lastDatarow( ).id = opt_id;
    this.model_.lastDatarow( ).title = opt_title;
    this.model_.lastDatarow( ).showClose = showClose;
    this.model_.lastDatarow( ).showResize = showResize;
    //this.model_.lastDatarow( ).height = height;
    this.model_.lastDatarow( ).width = width;
    this.model_.lastDatarow( ).top = opt_top;
    this.model_.lastDatarow( ).left = opt_left;
    this.model_.lastDatarow( ).icon = opt_icon;
    this.model_.lastDatarow( ).className = opt_className;
    this.model_.lastDatarow( ).show = true;

};

/**
 *  Open modal window for errors.
 *  @param {string} errorText
 */
zz.ide.services.ModalApi.prototype.openError = function( errorText ){

    var viewWrapperElement = goog.dom.getElement( zz.ide.enums.CssClass.VIEW_WRAPPER );
    var width = goog.style.getSize( viewWrapperElement ).width - 40;
    //var height = goog.dom.getViewportSize( ).height - 140;
    var top = 90;
    var left = goog.style.getPosition( viewWrapperElement).x + 20;
    //zz.ide.services.ModalApi
    //
    //    .getInstance( )
    //    .openModal(
    //
    //        zz.ide.enums.CssClass.MODAL_ERROR,
    //        'Error',
    //        true,
    //        false,
    //        undefined,//height,
    //        width,
    //        top,
    //        left,
    //        zz.ide.enums.Const.ICON_ERROR,
    //        zz.ide.enums.CssClass.MODAL_ERROR
    //    );

    this.model_.createLast( [

        zz.ide.enums.CssClass.MODAL_ERROR,
        'Error',
        true,
        false,
        undefined,
        width,
        top,
        left,
        zz.ide.enums.Const.ICON_ERROR,
        zz.ide.enums.CssClass.MODAL_ERROR,
        true
    ] );
    var modalErrorController = new zz.ide.controllers.ModalError( errorText );

    zz.ide.services.ModalApi

        .getInstance( )
        .renderChildController( modalErrorController );
};

/**
 *  Close modal window.
 *  @param {string=} opt_id
 */
zz.ide.services.ModalApi.prototype.closeModal = function( opt_id ){

    if( opt_id === zz.ide.enums.CssClass.MODAL_ERROR
    && this.model_.length > 1 ){

        this.getModalController( )

            .getChildAt(

                this.getModalController( )

                    .getChildCount( ) - 1
            )
            .dispose( );

        //this.model_.deleteLast( );
        this.model_.lastDatarow().show = false;
    }else{

        for( var i = 0; i < this.getModalController( ).getChildCount( ); i++ ){

            this.getModalController( ).getChildAt( i ).dispose( );
        }
        //this.model_.deleteLast( );
        this.model_.lastDatarow().show = false;
    }
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
 *  Set icon for modal window.
 *  @param {string} icon
 */
zz.ide.services.ModalApi.prototype.setIcon = function( icon ){

    this.model_.lastDatarow( ).icon = icon;
};


/**
 *  Set title for modal window..
 *  @param {string} title
 */
zz.ide.services.ModalApi.prototype.setTitle = function( title ){

    this.model_.lastDatarow( ).title = title;
};


/**
 *  Render child controller to modal window.
 *  @param {zz.ide.controllers.BaseViewController} controller
 */
zz.ide.services.ModalApi.prototype.renderChildController = function( controller ){

    var parents = goog.dom.getElementsByClass( zz.ide.enums.CssClass.MODAL_BODY );
    var parenElement =  parents[ 1 ] ? parents[ 1 ] : parents[ 0 ];

    this.getModalController( ).renderChildController(

        controller,
        parenElement
    );
};