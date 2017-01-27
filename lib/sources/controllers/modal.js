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

goog.provide( 'zz.ide.controllers.Modal' );

goog.require( 'goog.dom' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.environment.services.MVCRegistry' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.views.Modal' );
goog.require( 'zz.ide.models.Layout' );

/**
 * Modal controller.
 * @param {zz.ide.models.Modal} model
 * @param {zz.ide.views.Modal} view
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Modal = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Modal, zz.ide.controllers.BaseViewController );
zz.environment.services.MVCRegistry.setController( 'modal', zz.ide.controllers.Modal );

/**
 *  @override
 */
zz.ide.controllers.Modal.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    this.getHandler( ).listen(

        zz.environment.services.Environment.getInstance( ),
        zz.environment.enums.EventType.RESIZE,
        this.resizeHandler_,
        false
    );

    this.getHandler( ).listen(

        this.getModel( ),
        zz.models.enums.EventType.DATAROW_UPDATE,
        this.datarowUpdateHandler_,
        false
    );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Modal.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionCloseModal( e ) ){

        zz.ide.services.ModalApi

            .getInstance( )
            .closeModal( e.model.id );

    }else if( this.getView( ).isActionResizeModal( e ) ){

        console.log( 'resize' );
    }
    e.stopPropagation( );
};

/**
 * Resize event handler.
 * @param {zz.environment.events.Resize} e
 * @private
 */
zz.ide.controllers.Modal.prototype.resizeHandler_ = function( e ){

    if( this.getModel( ).lastDatarow( ).id === 'documentation' ){

        this.getModel( ).lastDatarow( ).width = goog.dom.getViewportSize( ).width - 436;

        this.getModel( ).lastDatarow( ).left =

            ( goog.dom.getViewportSize( ).width - this.getModel( ).lastDatarow( ).width )/2;

        this.getModel( ).lastDatarow().top = goog.dom.getViewportSize( ).height/2 - 107;

    }else{

        this.getModel( ).lastDatarow( ).top =  goog.dom.getViewportSize( ).height/2 - 112;
        this.getModel( ).lastDatarow( ).left = goog.dom.getViewportSize( ).width/2 - 190;
    }

    e.stopPropagation( );
};


/**
 * Datarow update event handler.
 * @param {zz.models.events.DatarowUpdate} e
 * @private
 */
zz.ide.controllers.Modal.prototype.datarowUpdateHandler_ = function( e ){

    if( e.message.datafield === this.getModel( ).datafield.top

        || e.message.datafield === this.getModel( ).datafield.left){

       this.getView( ).setPosition( this.getModel( ).lastDatarow( ).top, this.getModel( ).lastDatarow( ).left );
    }
    if( e.message.datafield === this.getModel( ).datafield.width

        || e.message.datafield === this.getModel( ).datafield.height){

        this.getView( ).setSize( this.getModel( ).lastDatarow( ).width, this.getModel( ).lastDatarow( ).height );
    }

    e.stopPropagation( );
};

