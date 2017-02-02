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

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.controllers.enums.EventType' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.ModalApi' );
goog.require( 'zz.ide.services.ConstantsConverter' );

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
//goog.require( 'zz.ide.controllers.ModalCopyFile' );

/**
 * File list controller.
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Filelist = function( opt_dom ){

    var model = new zz.ide.models.Filelist( );
    var view = zz.ide.views.Filelist.getInstance( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Filelist, zz.ide.controllers.BaseViewController );


/**
 * @override
 */
zz.ide.controllers.Filelist.prototype.setupListenersInternal = function( ){


    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    if( !this.getWSClient( ).isReady( ) ){

        this.getHandler( ).listenWithScope(

            this.getWSClient( ),
            zz.net.enums.EventType.WEB_SOCKET_READY,
            this.updateRequest,
            false,
            this
        );
    }
    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
        zz.ide.enums.Command.GET_CHILDREN,
        this.getChildrenHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
        zz.ide.enums.Command.CREATE_FILE,
        this.createFileHandler_,
        false,
        this
    );

    //this.getHandler( ).listenWithScope(
    //
    //    this.getWSClient( ),
    //    zz.ide.enums.Command.OPEN_FILE,
    //    this.openFileHandler_,
    //    false,
    //    this
    //);

    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
        zz.ide.enums.Command.REMOVE_FILE,
        this.removeFileHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.getWSClient( ),
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

    this.updateRequest( );
};


/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Filelist.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionOpen( e ) ){

        this.openFile_( e.model.name );

    //}else if( this.getView( ).isActionCopy( e )  ){
    //
    //    this.showCopyFileModal_( e.model.getUid( ) );

    }else if( this.getView( ).isActionDelete( e ) ){

        this.showDeleteFileModal_( e.model.getUid( ) );

    }else if( this.getView( ).isActionRename( e ) ){

        this.renameFile_( e.model.getUid( ) );
    }

    e.stopPropagation( );
};

/**
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.getChildrenHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var getChildrenMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
        if( getChildrenMessageModel.firstDatarow( ).stderr
            && getChildrenMessageModel.firstDatarow( ).stderr.length ){

            zz.ide.services.ModalApi

                .getInstance( )
                .openError(

                    getChildrenMessageModel

                        .firstDatarow( )
                        .stderr
                );

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
                    var icon = zz.ide.services.ConstantsConverter

                        .getInstance( )
                        .getIconFromRoute( this.router_.getFragment( ) + '/?file=' );
                    model.createLast( [ name, item.type, item.path, icon ] );

                }while( item = getChildrenMessageModel.firstDatarow( ).children.nextDatarow( ) );
            }
        }
    }
    e.stopPropagation( );
};


///**
// * Open file event handler.
// * @private
// */
//zz.ide.controllers.Filelist.prototype.openFileHandler_ = function( e ){
//
//    var openFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );
//
//    if( openFileMessageModel.firstDatarow( ).error.length ){
//
//        zz.environment.services.Environment
//
//            .getInstance( )
//            .getRootController( )
//            .getLayoutController( )
//            .openError( true, false, 100, 200, openFileMessageModel.firstDatarow( ).error );
//
//    }else{
//
//        var oldName = openFileMessageModel.firstDatarow( ).path
//
//            .slice( goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) + 1 );
//
//        var name = this.modifyName_( oldName );
//        var path = openFileMessageModel.firstDatarow( ).path
//
//            .slice( 0, goog.array.lastIndexOf( openFileMessageModel.firstDatarow( ).path, '/' ) );
//
//        zz.ide.services.ClientApi.getInstance( ).addFile(
//
//            name,
//            path,
//            openFileMessageModel.firstDatarow( ).content,
//            zz.ide.enums.Const.FILE
//        );
//    }
//
//    e.stopPropagation( );
//};

/**
 * Remove file event handler.
 * @param e
 * @private
 */
zz.ide.controllers.Filelist.prototype.removeFileHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var removeFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

        if( removeFileMessageModel.firstDatarow( ).stderr
            && removeFileMessageModel.firstDatarow( ).stderr.length ){

            zz.ide.services.ModalApi

                .getInstance( )
                .openError(

                    removeFileMessageModel
                        .firstDatarow( )
                        .stderr
                );
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
    }
    e.stopPropagation( );
};


/**
 * Create file event handler.
 * @param e
 * @private
 */
zz.ide.controllers.Filelist.prototype.createFileHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var createFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

        var filePath = createFileMessageModel.firstDatarow( ).path;
        var fileName = filePath.slice( goog.array.lastIndexOf( filePath, '/' ) + 1 );
        var model = this.getModel( );

        model.createLast( [ fileName, zz.ide.enums.Const.FILE, filePath ] );
    }

    e.stopPropagation( );
};

/**
 * Rename file event handler.
 * @param e
 * @private
 */
zz.ide.controllers.Filelist.prototype.renameFileHandler_ = function( e ){

    if( this.isCurrRoute( ) ){

        var renameFileMessageModel = new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

        if( renameFileMessageModel.lastDatarow( ).error
            && renameFileMessageModel.lastDatarow( ).error.length ){

            zz.ide.services.ModalApi

                .getInstance( )
                .openError(

                    renameFileMessageModel

                        .lastDatarow( )
                        .error
                );

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
    }
    e.stopPropagation( );
};

///**
// * Modify file name when it's created by copy.
// * @param {string} name
// * @return {string}
// * @private
// */
//zz.ide.controllers.Filelist.prototype.modifyName_ = function( name ){
//
//    var loop = true;
//    var fileExist = false;
//    var fileType = name.slice( goog.array.lastIndexOf( name, '.' ) );
//
//    if ( this.getModel( ).firstDatarow( ) ){
//
//        while ( loop ){
//
//            if ( this.getModel( ).currentDatarow( ).name !== name ){
//
//                fileExist = false;
//                loop = this.getModel( ).nextDatarow( );
//
//            }else{
//
//                fileExist = true;
//                loop = false;
//            }
//        }
//    }
//    if( fileExist ){
//
//        name = name.slice( 0, goog.array.lastIndexOf( name, '.' ) );
//        var newName = name + zz.ide.enums.Const.COPY_SUFFIX + fileType;
//        newName = this.modifyName_( newName );
//
//    }else{
//
//        var newName = name;
//    }
//    return newName;
//};
//
//
///**
// * Copy file.
// * @param {number} uid
// * @private
// */
//zz.ide.controllers.Filelist.prototype.showCopyFileModal_ = function( uid ){
//
//    var model = this.getModel( );
//    var loop = true;
//    var path;
//    if( !zz.environment.services.Environment
//
//            .getInstance( )
//            .getRootController( )
//            .getLayoutController( )
//            .getModel(  )
//            .lastDatarow( )
//            .modal
//            .length ){
//
//        zz.environment.services.Environment
//
//            .getInstance( )
//            .getRootController( )
//            .getLayoutController( )
//            .openModal(
//
//                true,
//                false,
//                200,
//                100,
//                ''
//            );
//
//        if( model.firstDatarow( ) ){
//
//            while( loop ){
//
//                if( model.currentDatarow( ).getUid(  ) === uid ){
//
//                    path = model.currentDatarow( ).path;
//                    loop = false;
//                    this.currentUid_ = uid;
//
//                }else{
//
//                    model.nextDatarow( );
//                }
//            }
//        }
//        /**
//         * Modal window for delete file controller.
//         * @type {zz.ide.controllers.ModalAddFile}
//         */
//        var modalCopyController = new zz.ide.controllers.ModalCopyFile( path );
//        modalCopyController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );
//    }
//};

/**
 * Open file.
 * @param {string} name
 * @private
 */
zz.ide.controllers.Filelist.prototype.openFile_ = function( name ){

    this.getRouter( ).setFragment(

        this.getRouter( ).getFragment( ) + '/?file=' + name
    );
};

/**
 * Show modal window for delete file.
 * @param {number} uid
 * @private
 */
zz.ide.controllers.Filelist.prototype.showDeleteFileModal_ = function( uid ){

    if( !zz.ide.services.ModalApi

            .getInstance( )
            .getModalModel( )
            .length ){

        zz.ide.services.ModalApi

            .getInstance( )
            .openModal(

                'deletefile',
                'Delete file',
                true,
                false,
                undefined,//215,
                380,
                goog.dom.getViewportSize( ).height/2 - 107,
                goog.dom.getViewportSize( ).width/2 - 190,
                'delete',
                zz.ide.enums.CssClass.MODAL_DELETE_FILE
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

        zz.ide.services.ModalApi

            .getInstance( )
            .renderChildController( modalDeleteController );
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
    var path, name;
    if( !zz.ide.services.ModalApi

            .getInstance( )
            .getModalModel( )
            .length ){

        zz.ide.services.ModalApi

            .getInstance( )
            .openModal(

                'renamefile',
                'Rename file',
                true,
                false,
                undefined,
                380,
                goog.dom.getViewportSize( ).height/2 - 112,
                goog.dom.getViewportSize( ).width/2 - 190,
                'edit',
                zz.ide.enums.CssClass.MODAL_RENAME_FILE
            );

        if( model.firstDatarow( ) ){

            while( loop ){

                if( model.currentDatarow( ).getUid(  ) === uid ){

                    path = model.currentDatarow( ).path;
                    name = model.currentDatarow( ).name;
                    loop = false;
                    this.currentUid_ = uid;

                }else{

                    model.nextDatarow( );
                }
            }
        }
        /**
         * Modal window for rename file controller.
         * @type {zz.ide.controllers.ModalAddFile}
         */
        var modalRenameController = new zz.ide.controllers.ModalRenameFile( path, name );
        zz.ide.services.ModalApi

            .getInstance( )
            .renderChildController( modalRenameController );
    }
};


/**
 *  Send request to server to get file list.
 */
zz.ide.controllers.Filelist.prototype.updateRequest = function( ){

    if( this.getWSClient( ).isReady( ) ){

        var path = zz.ide.services.ConstantsConverter

            .getInstance( )
            .getPathFromRoute( this.getRouter( ).getFragment( ) );

        zz.ide.services.ClientApi.getInstance( ).getFiles( path, zz.ide.enums.Const.FOLDER );
    }
};