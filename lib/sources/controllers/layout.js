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

goog.provide( 'zz.ide.controllers.Layout' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.controllers.enums.EventType' );

/**
 * Layout controller.
 * @param {zz.ide.models.Layout} model
 * @param {zz.ide.views.Layout} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Layout = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
};

goog.inherits( zz.ide.controllers.Layout, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'layout', zz.ide.controllers.Layout );

/**
 * override
 */
zz.ide.controllers.Layout.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );
    this.getModel( ).createLast( [undefined, undefined, undefined, 'add', false, false] );
};


/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Layout.prototype.actionHandler_ = function( e ){

    console.log( 'main action button', e );

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.MAIN_ACTION_BTN ) ){

        if( !this.getModel( ).lastDatarow( ).modalIsShown ){

            this.getModel( ).lastDatarow( ).modalIsShown = true;
        }
    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL_WINDOW ) ){

        this.getModel( ).lastDatarow( ).modalIsShown = false;
    }
    e.stopPropagation( );
};