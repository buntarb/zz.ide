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

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Modal' );
goog.require( 'zz.ide.models.Layout' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Modal controller.
 * @param {zz.ide.models.Modal} model
 * @param {zz.ide.views.Modal} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Modal = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Modal, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'modal', zz.ide.controllers.Modal );

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
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Modal.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionCloseModal( e ) ){

        this.getModel( ).deleteCurrent( );

    }else if( this.getView( ).isActionResizeModal( e ) ){

        console.log( 'resize' );
    }
    e.stopPropagation( );
};

