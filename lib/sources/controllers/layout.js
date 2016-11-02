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

goog.provide( 'zz.ide.controllers.Layout' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.controllers.ModalAddFile' );
goog.require( 'zz.app.controllers.FEBaseLayout' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.controllers.enums.EventType' );

/**
 * Layout controller.
 * @param {zz.ide.models.Layout} model
 * @param {zz.ide.views.Layout} view
 * @param opt_dom
 * @constructor
 * @extends {zz.app.controllers.FEBaseLayout}
 */
zz.ide.controllers.Layout = function( opt_dom ){

    var model = new zz.ide.models.Layout( );
    var view = zz.ide.views.Layout.getInstance( );
    goog.base( this, model, view, opt_dom );
    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );
};

goog.inherits( zz.ide.controllers.Layout, zz.app.controllers.FEBaseLayout );

/**
 *  @override
 */
zz.ide.controllers.Layout.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );


    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.COMPILE_APP,
        this.compileAppHandler_,
        false,
        this
    );
};

/**
 *  @override
 */
zz.ide.controllers.Layout.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( [ undefined, undefined, undefined, undefined, 'add', false ] );
};

/**
 * Action event handler.
 * @private
 */
zz.ide.controllers.Layout.prototype.actionHandler_ = function( e ){

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.MAIN_ACTION_BTN ) ){

        if( !zz.environment.services.Environment.getInstance( )

                .getRootController( )
                .getModel(  )
                .lastDatarow( )
                .modal
                .length ){

            this.openModal( true, false, 200, 100, '' );

            /**
             * Modal window for delete file controller.
             * @type {zz.ide.controllers.ModalAddFile}
             */
            var modalAddController = new zz.ide.controllers.ModalAddFile( this.getModel( ).lastDatarow( ).path );
            modalAddController.render( goog.dom.getElement( zz.ide.enums.CssClass.MODAL ) );
        }

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.COMPILE_APP ) ){

        if( !this.getModel( ).lastDatarow( ).compiling ){

            zz.ide.services.ClientApi.getInstance( ).compileApp( );
        }

        this.getModel( ).lastDatarow( ).compiling = true;
    }
};

/**
 * Compile app event handler.
 * @private
 */
zz.ide.controllers.Layout.prototype.compileAppHandler_ = function( e ){

    var error = goog.json.parse( e.messageData[ 0 ][ 4 ] )[ 0 ][ 5 ];

    if( error.length ){

        this.openError( true, false, 100, 200, error );

    }else{

        console.log( 'compile app answer', e );
    }
    this.getModel( ).lastDatarow( ).compiling = false;
};


/**
 *  Open modal window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string=} opt_title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Layout.prototype.openModal = function( showClose, showResize, height, width,

                                                               opt_title, opt_top, opt_left ){

    this.getModel( ).lastDatarow( ).modal.createLast( [ showClose, showResize, height, width,

        opt_title, opt_top, opt_left ] );
};

/**
 *  Close modal window.
 */
zz.ide.controllers.Layout.prototype.closeModal = function( ){

    this.getModel( ).lastDatarow( ).modal.deleteLast( );
};


/**
 *  Open error window.
 *  @param {boolean} showClose
 *  @param {boolean} showResize
 *  @param {number} height
 *  @param {number} width
 *  @param {string} title
 *  @param {number=} opt_top
 *  @param {number=} opt_left
 */
zz.ide.controllers.Layout.prototype.openError = function( showClose, showResize, height, width,

                                                               title, opt_top, opt_left ){

    this.getModel( ).lastDatarow( ).error.createLast( [ showClose, showResize, height, width,

        title, opt_top, opt_left ] );
};

/**
 *  Close error window.
 */
zz.ide.controllers.Layout.prototype.closeError = function( ){

    this.getModel( ).lastDatarow( ).error.deleteLast( );
};