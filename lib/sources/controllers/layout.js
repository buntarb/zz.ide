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
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.net.WebSocketClient' );

/**
 * Layout controller.
 * @param {zz.ide.models.Layout} model
 * @param {zz.ide.views.Layout} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Layout = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
    this.wsc_ = zz.net.WebSocketClient.getInstance( );
};

goog.inherits( zz.ide.controllers.Layout, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'layout', zz.ide.controllers.Layout );

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

    this.getModel( ).createLast( [ undefined, undefined, undefined, 'add', false ] );
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

            zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .openModal( true, false, 200, 100, '' );

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

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .openError( true, false, 100, 200, error );

    }else{

        console.log( 'compile app answer', e );
    }
    this.getModel( ).lastDatarow( ).compiling = false;
};