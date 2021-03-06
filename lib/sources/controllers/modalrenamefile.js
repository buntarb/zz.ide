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

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.views.ModalRenameFile' );
goog.require( 'zz.ide.models.ModalRenameFile' );
goog.require( 'zz.environment.services.Environment' );

/**
 * ModalRenameFile controller.
 * @param {string} path
 * @param {string} name
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.ModalRenameFile = function( path, name, opt_dom ){


    this.uniqName_;
    this.correctName_;
    /**
     * Modal window for delete file model.
     * @type {zz.ide.models.ModalRenameFile}
     */
    var modalRenameModel = new zz.ide.models.ModalRenameFile( );

    modalRenameModel.createLast( [
        path.split( name )[ 0 ],
        undefined,
        '',
        name ] );

    /**
     * Modal window for rename file view.
     * @type {zz.ide.views.ModalRenameFile}
     */
    var modalRenameView = zz.ide.views.ModalRenameFile.getInstance( );

    goog.base( this, modalRenameModel, modalRenameView, opt_dom );
};

goog.inherits( zz.ide.controllers.ModalRenameFile, zz.ide.controllers.BaseViewController );

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

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.INPUT,
        this.inputHandler_,
        false
    );
};

/**
 *  @override
 */
zz.ide.controllers.ModalRenameFile.prototype.bootstrap = function( ){

    var parent = this.getParent( );
    parent.getView( ).setSize( parent.getModel( ).lastDatarow( ).width, parent.getModel( ).lastDatarow( ).height );
    parent.getView( ).setPosition( parent.getModel( ).lastDatarow( ).top, parent.getModel( ).lastDatarow( ).left );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.ModalRenameFile.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionCloseModal( e ) ){

        zz.ide.services.ModalApi

            .getInstance( )
            .closeModal( );

    }else if( this.getView( ).isActionSave( e ) ){

        var pathFolder = e.model.path.slice( 0, goog.array.lastIndexOf( e.model.path, '/' ) + 1 );
        var path2 = pathFolder + e.model.path2;

        var filelistModel = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getViewController( )
            .getModel( );

        var loop = true;

        if ( filelistModel.firstDatarow( ) ){

            while ( loop ){

                if ( filelistModel.currentDatarow( ).path !== path2 ){

                    this.uniqName_ = true;
                    loop = filelistModel.nextDatarow( );

                }else{

                    this.uniqName_ = false;
                    loop = false;
                }
            }
        }
        if( e.model.path2 ){

            if( this.uniqName_ ){

                zz.ide.services.ClientApi.getInstance( ).renameFile(

                    e.model.path, path2 );

                zz.ide.services.ModalApi

                    .getInstance( )
                    .closeModal( );

            }else{

                this.getModel( )

                    .lastDatarow( )
                    .error = 'File with the same name ' + e.model.path2 + ' is already exist';
            }
        }else{

            this.getModel( )

                .lastDatarow( )
                .error = 'Type new name';
        }
    }
    e.stopPropagation( );
};

/**
 * Input event handler.
 * @param  e
 * @private
 */
zz.ide.controllers.ModalRenameFile.prototype.inputHandler_ = function( e ){

    this.correctName_ = goog.dom.pattern.matchStringOrRegex( /^[a-zA-Z][a-zA-Z0-9\.]+$/, e.newValue );

    if( !this.correctName_ ){

        this.getModel( )

            .lastDatarow( )
            .error = 'File name should consist of lower, upper case, numbers and start with a letter. Min 2 symbols.';
    }else{

        this.getModel( )

            .lastDatarow( )
            .error = '';
    }
};