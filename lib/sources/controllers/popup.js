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

goog.provide( 'zz.ide.controllers.Popup' );

goog.require( 'goog.dom' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.environment.services.MVCTree' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.views.Popup' );
goog.require( 'zz.ide.models.Layout' );

/**
 * Popup controller.
 * @param {zz.ide.models.Popup} model
 * @param {zz.ide.views.Popup} view
 * @param opt_dom
 * @constructor
 * @extend {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Popup = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Popup, zz.ide.controllers.BaseViewController );
zz.environment.services.MVCTree.registry.setController( 'popup', zz.ide.controllers.Popup );

/**
 *  @override
 */
zz.ide.controllers.Popup.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.Popup.prototype.actionHandler_ = function( e ){

    this.getModel( ).deleteCurrent( );

    e.stopPropagation( );
};

/**
 * Resize event handler.
 * @param {zz.environment.events.Resize} e
 * @private
 */
zz.ide.controllers.Popup.prototype.resizeHandler_ = function( e ){

    switch( this.getModel( ).lastDatarow( ).id ){

        case 'services':

            this.getModel( ).lastDatarow( ).left = goog.dom.getViewportSize( ).width - 340;
            break;

        case 'search':

            this.getModel( ).lastDatarow( ).left = goog.dom.getViewportSize( ).width/2 - 151;
            break;

        case 'ace-search':

            var element = goog.dom.getElement( zz.ide.enums.CssClass.ACE_EDITOR );

            this.getModel( ).lastDatarow( ).left = goog.style.getClientPosition( element ).x

                + goog.style.getSize( element ).width

                - 300;
            break;
    }

    e.stopPropagation( );
};


/**
 * Datarow update event handler.
 * @param {zz.models.events.DatarowUpdate} e
 * @private
 */
zz.ide.controllers.Popup.prototype.datarowUpdateHandler_ = function( e ){

    if( e.message.datafield === this.getModel( ).datafield.top

        || e.message.datafield === this.getModel( ).datafield.left){

        this.getView( ).setPosition( this.getModel( ).lastDatarow( ).top, this.getModel( ).lastDatarow( ).left );
    }

    e.stopPropagation( );
};
