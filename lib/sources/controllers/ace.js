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

goog.provide( 'zz.ide.controllers.Ace' );

goog.require( 'goog.dom' );
goog.require( 'goog.Timer');

goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Ace' );
goog.require( 'zz.ide.models.Ace' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Ace controller.
 * @param {zz.ide.models.Ace} model
 * @param {zz.ide.views.Ace} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Ace = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.wsc_ = zz.ide.services.ClientApi.getInstance( ).getWSClient( );

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
};

goog.inherits( zz.ide.controllers.Ace, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'ace', zz.ide.controllers.Ace );

/**
 * override
 */
zz.ide.controllers.Ace.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );
};

/**
 * Initialize ace editor.
 * @private
 */
zz.ide.controllers.Ace.prototype.initializeEditor_ = function(  ){

    var datarow = this.getModel( ).lastDatarow( );

    datarow.height =

        zz.environment.services.Environment.getInstance( ).viewport.getSize( ).height

        - zz.ide.enums.Const.CORRECTION_HEIGHT;

    var editor = window[ 'ace' ][ 'edit' ]( goog.getCssName( 'ace' ) );
    editor[ 'setTheme' ]( datarow.theme );
    editor[ 'getSession' ]( )[ 'setMode' ]( datarow.syntax );
    editor[ 'setValue' ]( datarow.content, -1 );

    var self = this;
    var id;

    editor.getSession( ).on( 'change', function( e ){

        if( id ){

            goog.Timer.clear( id );
        }
        id = goog.Timer.callOnce( function( ){

            self.getModel( ).lastDatarow( ).content = editor[ 'getValue' ]( );
            zz.ide.services.ClientApi.getInstance( ).saveFile( self.getModel( ).lastDatarow( ) );
        }, zz.ide.enums.Const.SAVE_FILE_DELAY );
    });
};

/**
 * Get children event handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.getChildrenHandler_ = function( e ){

    var dataset = new zz.net.models.MessageDataset( null, e.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var model;
    var modelDatarow;

    if( datarow.type === zz.net.enums.MessageType.ERROR ){

        model = new zz.net.models.ErrorDataset( null, goog.json.unsafeParse( datarow.data ) );
        modelDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( model.firstDatarow( ) );
        console.log( modelDatarow.code + ': ' + modelDatarow.message );

    }else{

        model = this.getModel( );

        if( model.length ){

            while( model.deleteCurrent( ) ){}
        }
    }

    e.stopPropagation( );
};

/**
 * Open file event handler.
 * @private
 */
zz.ide.controllers.Ace.prototype.openFileHandler_ = function( e ){

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

        var fileType = data[ 0 ][ 0 ].slice( data[ 0 ][ 0 ].lastIndexOf( '.' ) + 1 );

        var aceMode;

        if( fileType === zz.ide.enums.Const.JS ){

            aceMode = zz.ide.enums.Const.ACE_MODE_JS;

        }else if( fileType === zz.ide.enums.Const.YAML ){

            aceMode = zz.ide.enums.Const.ACE_MODE_YAML;

        }else if( fileType === zz.ide.enums.Const.SCSS ){

            aceMode = zz.ide.enums.Const.ACE_MODE_SCSS;

        }else if( fileType === zz.ide.enums.Const.SOY ){

            aceMode = zz.ide.enums.Const.ACE_MODE_SOY;

        }else if( fileType === zz.ide.enums.Const.JSON ){

            aceMode = zz.ide.enums.Const.ACE_MODE_JSON;

        }else if( fileType === zz.ide.enums.Const.TPL ){

            aceMode = zz.ide.enums.Const.ACE_MODE_TPL;
        }

        model = this.getModel( );

        if( model.length ){

            while( model.deleteCurrent( ) ){}
        }

        this.getModel( ).createLast( [

            zz.ide.enums.Const.ACE_THEME_CHROME,
            aceMode,
            undefined,
            data[ 0 ][ 3 ],
            data[ 0 ][ 0 ],
            data[ 0 ][ 1 ],
            data[ 0 ][ 2 ]
        ] );

        this.initializeEditor_( );
    }

    e.stopPropagation( );
};