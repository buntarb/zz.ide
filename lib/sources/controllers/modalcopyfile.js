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

goog.provide( 'zz.ide.controllers.ModalCopyFile' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.views.ModalCopyFile' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.environment.services.Environment' );

/**
 * ModalCopyFile controller.
 * @param {string} path
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.ModalCopyFile = function( path, opt_dom ){

    /**
     * Modal window for delete file model.
     * @type {zz.ide.models.FilesTree}
     */
    var modalCopyModel = new zz.ide.models.FilesTree( );

    modalCopyModel.createLast( [ path ] );

    /**
     * Modal window for rename file view.
     * @type {zz.ide.views.ModalCopyFile}
     */
    var modalCopyView = zz.ide.views.ModalCopyFile.getInstance( );

    goog.base( this, modalCopyModel, modalCopyView, opt_dom );
};

goog.inherits( zz.ide.controllers.ModalCopyFile, zz.ide.controllers.BaseViewController );

/**
 *  @override
 */
zz.ide.controllers.ModalCopyFile.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.ModalCopyFile.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionCloseModal( e ) ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .closeModal( );

    }else if( this.getView( ).isActionSave( e ) ){

        console.log( 'copyfile' )
    }
    e.stopPropagation( );
};