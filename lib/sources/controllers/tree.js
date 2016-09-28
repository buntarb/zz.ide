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

goog.provide( 'zz.ide.controllers.Tree' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Tree' );
goog.require( 'zz.ide.models.Tree' );
goog.require( 'zz.models.enums.EventType' );

/**
 * Tree controller.
 * @param {zz.ide.models.Tree} model
 * @param opt_dom
 * @constructor
 */
zz.ide.controllers.Tree = function( model, opt_dom ){

    /**
     * Tree view.
     * @type {zz.ide.views.Tree}
     */
    var view = zz.ide.views.Tree.getInstance( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Tree, zz.controllers.FEBase );

/**
 * @override
 */
zz.ide.controllers.Tree.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );
    this.getHandler( ).listen(

        this,
        goog.ui.Component.EventType.ACTION,
        this.actionHandler_,
        false
    );

    this.getHandler( ).listen(

        this.getModel( ),
        zz.models.enums.EventType.DATAROW_CREATE,
        this.datarowCreatedHandler_,
        false
    );
};

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Tree.prototype.actionHandler_ = function( e ){

    console.log( "handleAction", e );

    var model = e.item.model.children;
    model.createLast( [ 'id' + e.item.model.getUid(), 'folder' ] );
    model.createLast( [ 'file', 'file' ] );
    e.stopPropagation( );
};

/**
 * Datarow created event handler.
 * @private
 */
zz.ide.controllers.Tree.prototype.datarowCreatedHandler_ = function( e ){

    var controller = new zz.ide.controllers.Tree( e.message.datarow.children );
    this.addFieldController(

        e.message.datarow,
        this.getModel( ).datafield.children,
        controller );
};