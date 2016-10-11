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

goog.provide( 'zz.ide.controllers.Filelist' );

goog.require( 'goog.dom' );
goog.require( 'goog.array' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Filelist' );
goog.require( 'zz.ide.models.Filelist' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Filelist controller.
 * @param {zz.ide.models.Filelist} model
 * @param {zz.ide.views.Filelist} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Filelist = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
};

goog.inherits( zz.ide.controllers.Filelist, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'filelist', zz.ide.controllers.Filelist );

/**
 * override
 */
zz.ide.controllers.Filelist.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );
    this.getModel( ).createLast( [undefined, undefined, 'view.js'] );
    this.getModel( ).createLast( [undefined, undefined, 'view1.js'] );
    this.getModel( ).createLast( [undefined, undefined, 'view2.js'] );
    this.getModel( ).createLast( [undefined, undefined, 'view3.js'] );
    this.getModel( ).createLast( [undefined, undefined, 'view4.js'] );
    this.getModel( ).createLast( [undefined, undefined, 'view5.js'] );
};

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.actionHandler_ = function( e ){

    var model = this.getModel( );
    var loop = true;

    if( model.firstDatarow( ) ){

        while( loop ){

            if( model.currentDatarow().getUid(  ) === e.model.getUid( ) ){

                model.deleteCurrent( );
                loop = false;
            }else{

                model.nextDatarow( );
            }
        }
    }


    e.stopPropagation( );
};