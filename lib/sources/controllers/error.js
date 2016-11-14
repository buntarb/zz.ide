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

goog.provide( 'zz.ide.controllers.Error' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Error' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Error controller.
 * @param {zz.ide.models.Error} model
 * @param {zz.ide.views.Error} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Error = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Error, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'error', zz.ide.controllers.Error );

/**
 *  @override
 */
zz.ide.controllers.Error.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.Error.prototype.actionHandler_ = function( e ){

    if( this.getView().isActionCloseModal( ) ){

        this.getModel( ).deleteCurrent( );

    }else if( this.getView( ).isActionResizeModal( ) ){

        console.log( 'resize' );
    }
    e.stopPropagation( );
};

