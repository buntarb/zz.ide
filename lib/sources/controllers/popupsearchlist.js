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

goog.provide( 'zz.ide.controllers.PopupSearchlist' );

goog.require( 'goog.dom' );

goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.controllers.Documentation' );
goog.require( 'zz.controllers.enums.EventType' );

goog.require( 'zz.ide.enums.DataAction' );

goog.require( 'zz.ide.views.PopupSearchlist' );

/**
 * File list controller.
 * @param {zz.ide.models.PopupSearchlist} model
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.PopupSearchlist = function( model, opt_dom ){

    var view = zz.ide.views.PopupSearchlist.getInstance( );

    goog.base( this, model, view, opt_dom );
};


goog.inherits( zz.ide.controllers.PopupSearchlist, zz.ide.controllers.BaseViewController );


/**
 * @override
 */
zz.ide.controllers.PopupSearchlist.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
};

/**
 *  @override
 */
zz.ide.controllers.PopupSearchlist.prototype.setupModelInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.PopupSearchlist.prototype.bootstrap = function( ){

    var parent = this.getParent( );
    parent.getView( ).setSize( parent.getModel( ).lastDatarow( ).width, parent.getModel( ).lastDatarow( ).height );
    parent.getView( ).setPosition( parent.getModel( ).lastDatarow( ).top, parent.getModel( ).lastDatarow( ).left );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.PopupSearchlist.prototype.actionHandler_ = function( e ){

    var model = this.getModel( );
    var loop = true;

    //if( model.firstDatarow( ) ){
    //
    //    while( loop ){
    //
    //        if( model.currentDatarow( ).getUid( ) === e.model.getUid( ) ){
    //
    //            this.getLayout( ).openModal( e.model.name, true, false, 100, 100 );
    //            loop = false;
    //
    //        }else{
    //
    //            model.nextDatarow( );
    //        }
    //    }
    //}

    this.getLayout( ).closePopup( );

    this.getLayout( ).openModal(

        '',
        true,
        false,
        215,
        380,
        goog.dom.getViewportSize( ).height/2 - 107,
        goog.dom.getViewportSize( ).width/2 - 190);


    /**
     * Modal window for documentation.
     * @type {zz.ide.controllers.Documentation}
     */
    var documentationController = new zz.ide.controllers.Documentation( );
    documentationController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );

    e.stopPropagation( );
};