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
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Filelist' );
goog.require( 'zz.ide.models.Filelist' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
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

    this.wsc_ = zz.ide.services.ClientApi.getInstance( ).getWSClient( );

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
        zz.ide.enums.Command.SAVE_FILE,
        this.saveFileHandler_,
        false,
        this
    );
};

goog.inherits( zz.ide.controllers.Filelist, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'filelist', zz.ide.controllers.Filelist );

/**
 * override
 */
zz.ide.controllers.Filelist.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );
};

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.actionHandler_ = function( e ){

    var command = e.elements[ 0 ].attributes[ 1 ].nodeValue;

    if( command === zz.ide.enums.Const.DELETE ){

        var model = this.getModel( );
        var loop = true;

        if( model.firstDatarow( ) ){

            while( loop ){

                if( model.currentDatarow( ).getUid(  ) === e.model.getUid( ) ){

                    model.deleteCurrent( );
                    loop = false;
                }else{

                    model.nextDatarow( );
                }
            }
        }
    }else if( command === zz.ide.enums.Const.OPEN ){

        console.log( e );
        zz.ide.services.ClientApi.getInstance( ).getFiles( e.model );

    }else if( command === zz.ide.enums.Const.MENU ){

        console.log( 'menu' );
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
 * Save file event handler.
 * @private
 */
zz.ide.controllers.Filelist.prototype.saveFileHandler_ = function( e ){

    console.log( 'save file', e );

    e.stopPropagation( );
};
