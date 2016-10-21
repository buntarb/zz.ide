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

goog.provide( 'zz.ide.controllers.ModalDeleteFile' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.ModalDeleteFile' );
goog.require( 'zz.ide.models.Layout' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.environment.services.Environment' );

/**
 * ModalDeleteFile controller.
 * @param {zz.ide.models.ModalDeleteFile} model
 * @param {zz.ide.views.ModalDeleteFile} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.ModalDeleteFile = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.ModalDeleteFile, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'modaldeletefile', zz.ide.controllers.ModalDeleteFile );

/**
 *  @override
 */
zz.ide.controllers.ModalDeleteFile.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
};

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.ModalDeleteFile.prototype.actionHandler_ = function( e ){

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL ) ){

        zz.environment.services.Environment.getInstance( ).getRootController( ).closeModal( );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.DELETE ) ){

        zz.ide.services.ClientApi.getInstance( ).deleteFile( e.model );
        zz.environment.services.Environment.getInstance( ).getRootController( ).closeModal( );
    }
    e.stopPropagation( );
};