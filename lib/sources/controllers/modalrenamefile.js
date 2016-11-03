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

goog.provide( 'zz.ide.controllers.ModalRenameFile' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.ModalRenameFile' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.environment.services.Environment' );

/**
 * ModalRenameFile controller.
 * @param {string} path
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.ModalRenameFile = function( path, opt_dom ){

    /**
     * Modal window for delete file model.
     * @type {zz.ide.models.FilesTree}
     */
    var modalRenameModel = new zz.ide.models.FilesTree( );

    modalRenameModel.createLast( [ path ] );

    /**
     * Modal window for rename file view.
     * @type {zz.ide.views.ModalRenameFile}
     */
    var modalRenameView = zz.ide.views.ModalRenameFile.getInstance( );

    goog.base( this, modalRenameModel, modalRenameView, opt_dom );
};

goog.inherits( zz.ide.controllers.ModalRenameFile, zz.controllers.FEBase );

/**
 *  @override
 */
zz.ide.controllers.ModalRenameFile.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.ModalRenameFile.prototype.actionHandler_ = function( e ){

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL ) ){

        zz.environment.services.Environment.getInstance( ).getRootController( ).closeModal( );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SAVE ) ){

        var pathFolder = e.model.path.slice( 0, goog.array.lastIndexOf( e.model.path, '/' ) + 1 );
        var path2 = pathFolder + e.model.path2;

        var filelistModel = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getViewController( )
            .getModel( );

        var loop = true;
        var renameFile = false;

        if ( filelistModel.firstDatarow( ) ){

            while ( loop ){

                if ( filelistModel.currentDatarow( ).path !== path2 ){

                    renameFile = true;
                    loop = filelistModel.nextDatarow( );

                }else{

                    renameFile = false;
                    loop = false;
                }
            }
        }
        if( renameFile ){

            zz.ide.services.ClientApi.getInstance( ).renameFile(

                e.model.path, path2 );

            zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .getLayoutController( )
                .closeModal( );

        }else{

            zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .getModel( ).lastDatarow( )
                .modal.lastDatarow( ).title = 'File with the same name ' + e.model.path2 + ' is already exist';
        }
    }
    e.stopPropagation( );
};