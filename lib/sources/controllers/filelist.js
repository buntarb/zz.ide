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
goog.require( 'goog.json' );

goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.net.models.MessageDataset' );
goog.require( 'zz.net.WebSocketClient' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.controllers.enums.EventType' );

goog.require( 'zz.ide.services.ClientApi' );

goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.DataAction' );

goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.models.Filelist' );

goog.require( 'zz.ide.views.Filelist' );
goog.require( 'zz.ide.views.ModalDeleteFile' );

goog.require( 'zz.ide.controllers.ModalDeleteFile' );
goog.require( 'zz.ide.controllers.ModalRenameFile' );

/**
 * File list controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Filelist = function( opt_dom ){

    var model = new zz.ide.models.Filelist( );
    var view = zz.ide.views.Filelist.getInstance( );

    goog.base( this, model, view, opt_dom );

    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );

    this.openFile_;
};

goog.inherits( zz.ide.controllers.Filelist, zz.controllers.FEBase );


/**
 * Setup listeners.
 */
zz.ide.controllers.Filelist.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    if( !this.wsc_.isReady( ) ){

        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.net.enums.EventType.WEB_SOCKET_READY,
            this.setupModelInternal,
            false,
            this
        );
    }
    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.GET_CHILDREN,
        this.getChildrenHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.SAVE_FILE,
        this.saveFileHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.OPEN_FILE,
        this.openFileHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.REMOVE_FILE,
        this.removeFileHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.RENAME_FILE,
        this.renameFileHandler_,
        false,
        this
    );
};

/**
 *  @override
 */
zz.ide.controllers.Filelist.prototype.setupModelInternal = function( ){

    if( this.wsc_.isReady( ) ){

        var path;
        switch( this.router_.getFragment( ) ){

            case zz.ide.enums.Route.MODELS:

                path = zz.ide.enums.Path.MODELS;
                break;

            case zz.ide.enums.Route.TEMPLATES:

                path = zz.ide.enums.Path.TEMPLATES;
                break;

            case zz.ide.enums.Route.STYLES:

                path = zz.ide.enums.Path.STYLES;
                break;

            case zz.ide.enums.Route.MESSAGES:

                path = zz.ide.enums.Path.MESSAGES;
                break;

            case zz.ide.enums.Route.RESOURCES:

                path = zz.ide.enums.Path.RESOURCES;
                break;

            case zz.ide.enums.Route.CONTROLLERS:

                path = zz.ide.enums.Path.CONTROLLERS;
                break;

            case zz.ide.enums.Route.ENUMS:

                path = zz.ide.enums.Path.ENUMS;
                break;

            case zz.ide.enums.Route.ERRORS:

                path = zz.ide.enums.Path.ERRORS;
                break;

            case zz.ide.enums.Route.EVENTS:

                path = zz.ide.enums.Path.EVENTS;
                break;

            case zz.ide.enums.Route.FACTORIES:

                path = zz.ide.enums.Path.FACTORIES;
                break;

            case zz.ide.enums.Route.SERVICES:

                path = zz.ide.enums.Path.SERVICES;
                break;

            case zz.ide.enums.Route.VIEWS:

                path = zz.ide.enums.Path.VIEWS;
                break;

            case zz.ide.enums.Route.TESTS:

                path = zz.ide.enums.Path.TESTS;
                break;

            case zz.ide.enums.Route.INDEX:

                path = zz.ide.enums.Path.INDEX;
                break;

            default:

                break;
        }
        zz.ide.services.ClientApi.getInstance( ).getFiles( path, zz.ide.enums.Const.FOLDER );
    }
};

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.actionHandler_ = function( e ){

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.OPEN ) ){

        this.openFile_( e.model.name );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COPY)  ){

        this.copyFile_( e.model.path );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SHOW_DELETE_FILE_MODAL ) ){

        this.showDeleteFileModal_( e.model.getUid( ) );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.RENAME ) ){

        this.renameFile_( e.model.getUid( ) );
    }

    e.stopPropagation( );
};


/**
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.getChildrenHandler_ = function( e ){

    var getChildrenMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
    if( getChildrenMessageModel.firstDatarow( ).error.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openError( true, false, 100, 200, getChildrenMessageModel.firstDatarow( ).error );

    }else{

        var item;
        var model = this.getModel( );

        if( model.length ){

            while( model.deleteCurrent( ) ){}
        }
        if( item = getChildrenMessageModel.firstDatarow( ).children.firstDatarow( ) ){

            do{

                var index = goog.array.lastIndexOf( item.path, '/' );
                var name = item.path.slice( index + 1 );
                model.createLast( [ name, item.type, item.path ] );

            }while( item = getChildrenMessageModel.firstDatarow( ).children.nextDatarow( ) );
        }
    }
    e.stopPropagation( );
};


/**
 * Open file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.openFileHandler_ = function( e ){

    var openFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( openFileMessageModel.firstDatarow( ).error.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openError( true, false, 100, 200, openFileMessageModel.firstDatarow( ).error );

    }else{

        if( this.openFile_ ){

            var model = this.getModel( );

            if( model.length ){

                while( model.deleteCurrent( ) ){}
            }

        }else{

            var oldName = openFileMessageModel.firstDatarow( ).path

                .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) + 1 );

            var name = this.modifyName_( oldName );
            var path = openFileMessageModel.firstDatarow( ).path

                .slice( 0, goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) + 1 );

            zz.ide.services.ClientApi.getInstance( ).addFile(

                name,
                path,
                openFileMessageModel.firstDatarow( ).content,
                zz.ide.enums.Const.FILE
            );
        }
    }

    e.stopPropagation( );
};

/**
 * Remove file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.removeFileHandler_ = function( e ){

    var removeFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( removeFileMessageModel.firstDatarow( ).error.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openError( true, false, 100, 200, removeFileMessageModel.firstDatarow( ).error  );

    }else{

        var model = this.getModel( );
        var loop = true;

        if( model.firstDatarow( ) ){

            while( loop ){

                if( model.currentDatarow( ).getUid( ) === this.currentUid_ ){

                    model.deleteCurrent( );
                    loop = false;
                    this.currentUid_ = undefined;

                }else{

                    model.nextDatarow( );
                }
            }
        }
    }
    e.stopPropagation( );
};


/**
 * Save file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.saveFileHandler_ = function( e ){

    var saveFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
    var filePath = saveFileMessageModel.firstDatarow( ).path;
    var fileName = filePath.slice( goog.array.lastIndexOf( filePath, '/' ) + 1 );
    var model = this.getModel( );

    if( goog.array.indexOf( this.router_.getFragment( ), /file=/g ) < 0 ){

        model.createLast( [ fileName, zz.ide.enums.Const.FILE, filePath ] );
    }
    e.stopPropagation( );
};

/**
 * Rename file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.renameFileHandler_ = function( e ){

    var renameFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( renameFileMessageModel.lastDatarow( ).error.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openError( true, false, 100, 200, renameFileMessageModel.lastDatarow( ).error );

    }else{

        var model = this.getModel( );
        var loop = true;

        if ( model.firstDatarow( ) ){

            while ( loop ){

                if ( model.currentDatarow( ).path !== renameFileMessageModel.lastDatarow( ).path ){

                    loop = model.nextDatarow( );

                }else{

                    model.currentDatarow( ).path = renameFileMessageModel.lastDatarow( ).path2;
                    model.currentDatarow( ).name =

                        model.currentDatarow( ).path.
                        slice(  goog.array.lastIndexOf( model.currentDatarow( ).path, '/' ) + 1 );
                    loop = false;
                }
            }
        }
    }
    e.stopPropagation( );
};

/**
 * Modify file name when it's created by copy.
 * @param {string} name
 * @return {string}
 * @private
 */
zz.ide.controllers.Filelist.prototype.modifyName_ = function( name ){

    var loop = true;
    var fileExist = false;
    var fileType = name.slice( goog.array.lastIndexOf( name, '.' ) );

    if ( this.getModel( ).firstDatarow( ) ){

        while ( loop ){

            if ( this.getModel( ).currentDatarow( ).name !== name ){

                fileExist = false;
                loop = this.getModel( ).nextDatarow( );

            }else{

                fileExist = true;
                loop = false;
            }
        }
    }
    if( fileExist ){

        name = name.slice( 0, goog.array.lastIndexOf( name, '.' ) );
        var newName = name + zz.ide.enums.Const.COPY_SUFFIX + fileType;
        newName = this.modifyName_( newName );

    }else{

        var newName = name;
    }
    return newName;
};

/**
 * Open file.
 * @param {string} path
 * @private
 */
zz.ide.controllers.Filelist.prototype.openFile_ = function( name ){

    this.openFile_ = true;
    this.router_.setFragment(

        this.router_.getFragment( ) + '/?file=' + name
    );
};

/**
 * Copy file.
 * @param {string} path
 * @private
 */
zz.ide.controllers.Filelist.prototype.copyFile_ = function( path ){

    this.openFile_ = false;
    zz.ide.services.ClientApi.getInstance( ).getFiles( path, zz.ide.enums.Const.FILE  );
};

/**
 * Show modal window for delete file.
 * @param {number} uid
 * @private
 */
zz.ide.controllers.Filelist.prototype.showDeleteFileModal_ = function( uid ){

    if( !zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getModel(  ).lastDatarow( ).modal.length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openModal(

                true,
                false,
                200,
                100,
                ''
            );

        var model = this.getModel( );
        var loop = true;

        /**
         * Modal window for delete file model.
         * @type {zz.ide.models.Filelist}
         */
        var modalDeleteModel = new zz.ide.models.Filelist( );

        if( model.firstDatarow( ) ){

            while( loop ){

                if( model.currentDatarow( ).getUid(  ) === uid ){

                    modalDeleteModel.createLast( [

                        model.currentDatarow( ).name,
                        model.currentDatarow( ).type,
                        model.currentDatarow( ).path,
                        model.currentDatarow( ).icon,
                        model.currentDatarow( ).color
                    ] );
                    loop = false;
                    this.currentUid_ = uid;

                }else{

                    model.nextDatarow( );
                }
            }
        }

        /**
         * Modal window for delete file view.
         * @type {zz.ide.views.ModalDeleteFile}
         */
        var modalDeleteView = zz.ide.views.ModalDeleteFile.getInstance( );

        /**
         * Modal window for delete file controller.
         * @type {zz.ide.controllers.ModalDeleteFile}
         */
        var modalDeleteController = new zz.ide.controllers.ModalDeleteFile( modalDeleteModel, modalDeleteView );

        modalDeleteController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );
    }
};

/**
 * Rename file.
 * @param {number} uid
 * @private
 */
zz.ide.controllers.Filelist.prototype.renameFile_ = function( uid ){

    var model = this.getModel( );
    var loop = true;
    var path;
    if( !zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getModel(  )
            .lastDatarow( )
            .modal
            .length ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .openModal(

                true,
                false,
                200,
                100,
                ''
            );

        if( model.firstDatarow( ) ){

            while( loop ){

                if( model.currentDatarow( ).getUid(  ) === uid ){

                    path = model.currentDatarow( ).path;
                    loop = false;
                    this.currentUid_ = uid;

                }else{

                    model.nextDatarow( );
                }
            }
        }
        /**
         * Modal window for delete file controller.
         * @type {zz.ide.controllers.ModalAddFile}
         */
        var modalAddController = new zz.ide.controllers.ModalRenameFile( path );
        modalAddController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );
    }
};