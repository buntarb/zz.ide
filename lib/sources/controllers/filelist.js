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

goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Filelist' );
goog.require( 'zz.ide.models.Filelist' );
goog.require( 'zz.ide.controllers.ModalDeleteFile' );
goog.require( 'zz.ide.views.ModalDeleteFile' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.net.enums.MessageType' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.net.models.MessageDataset' );

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

    //this.wsc_ = zz.environment.services.Environment.getInstance( ).getWsClient( );
    this.wsc_ = zz.net.WebSocketClient.getInstance( );
    this.currentUid_;
};

goog.inherits( zz.ide.controllers.Filelist, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'filelist', zz.ide.controllers.Filelist );


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

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.GET_CHILDREN,
        this.getChildrenHandler_,
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
};
/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.actionHandler_ = function( e ){


    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.OPEN ) ){

        console.log( e );
        zz.ide.services.ClientApi.getInstance( ).getFiles( e.model );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.MENU ) ){

        console.log( 'menu' );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SHOW_DELETE_FILE_MODAL ) ){

        if( !zz.environment.services.Environment.getInstance( )

                .getRootController( ).getModel(  ).lastDatarow( ).modal.length ){

            zz.environment.services.Environment.getInstance( ).getRootController( ).openModal( true, false, 200, 100 );

            var model = this.getModel( );
            var loop = true;

            /**
             * Modal window for delete file model.
             * @type {zz.ide.models.Filelist}
             */
            var modalDeleteModel = new zz.ide.models.Filelist( );

            if( model.firstDatarow( ) ){

                while( loop ){

                    if( model.currentDatarow( ).getUid(  ) === e.model.getUid( ) ){

                        modalDeleteModel.createLast( [

                            model.currentDatarow( ).name,
                            model.currentDatarow( ).type,
                            model.currentDatarow( ).path,
                            model.currentDatarow( ).icon,
                            model.currentDatarow( ).color
                        ] );
                        loop = false;
                        this.currentUid_ = e.model.getUid( );

                    }else{

                        model.nextDatarow( );
                    }
                }
            }

            /**
             * Modal window for delete file view.
             * @type {zz.ide.views.ModalDeleteFile}
             */
            var modalDeleteView = new zz.ide.views.ModalDeleteFile( );

            /**
             * Modal window for delete file controller.
             * @type {zz.ide.controllers.ModalDeleteFile}
             */
            var modalDeleteController = new zz.ide.controllers.ModalDeleteFile( modalDeleteModel, modalDeleteView );

            modalDeleteController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );
        }
    }

    e.stopPropagation( );
};


/**
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.getChildrenHandler_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var model;
    var modelDatarow;

    if( datarow.type === zz.net.enums.MessageType.ERROR ){

        model = new zz.net.models.ErrorDataset( null, goog.json.unsafeParse( datarow.data ) );
        modelDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( model.firstDatarow( ) );
        console.log( modelDatarow.code + ': ' + modelDatarow.message );

    }else{

        var data = goog.json.unsafeParse(datarow.data)[ 0 ][ 4 ];
        model = this.getModel( );

        if( model.length ){

            while( model.deleteCurrent( ) ){}
        }
        goog.array.forEach( data, function( item ){

            model.createLast( [item[ 0 ], item[ 1 ],item[ 2 ]] );
        });
    }

    e.stopPropagation( );
};


/**
 * Open file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.openFileHandler_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var model;
    var modelDatarow;

    if( datarow.type === zz.net.enums.MessageType.ERROR ){

        model = new zz.net.models.ErrorDataset( null, goog.json.unsafeParse( datarow.data ) );
        modelDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( model.firstDatarow( ) );
        console.log( modelDatarow.code + ': ' + modelDatarow.message );

    }else{

        var data = goog.json.unsafeParse( datarow.data );
        console.log( this.getParent( ));
        model = this.getModel( );

        if( model.length ){

            while( model.deleteCurrent( ) ){}
        }
    }

    e.stopPropagation( );
};

/**
 * Remove file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.removeFileHandler_ = function( e ){

    if( datarow.type === zz.net.enums.MessageType.ERROR ){

        model = new zz.net.models.ErrorDataset( null, goog.json.unsafeParse( datarow.data ) );
        modelDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( model.firstDatarow( ) );
        console.log( modelDatarow.code + ': ' + modelDatarow.message );

    }else {

        var model = this.getModel();
        var loop = true;

        if (model.firstDatarow()) {

            while (loop) {

                if (model.currentDatarow().getUid() === this.currentUid_) {

                    model.deleteCurrent();
                    loop = false;
                    this.currentUid_ = undefined;

                } else {

                    model.nextDatarow();
                }
            }
        }
    }
};
