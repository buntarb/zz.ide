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

goog.provide( 'zz.ide.controllers.Services' );

goog.require( 'goog.window' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.CssClass' );

goog.require( 'zz.ide.views.Services' );

/**
 * Services controller.
 * @param {zz.ide.models.Services} model
 * @param {zz.ide.views.Services} view
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Services = function( model, view ){

    var view = view || zz.ide.views.Services.getInstance( );

    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );

    this.layout_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( );

    goog.base( this, model, view );
};

goog.inherits( zz.ide.controllers.Services, zz.ide.controllers.BaseViewController );
zz.environment.services.MVCRegistry.setController( 'services', zz.ide.controllers.Services );

/**
 * @override
 */
zz.ide.controllers.Services.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.START_SERVER,
        this.startSrvMessageHandler_,
        false,
        this
    );

    this.getHandler( ).listenWithScope(

        this.wsc_,
        zz.ide.enums.Command.STOP_SERVER,
        this.stopSrvMessageHandler_,
        false,
        this
    );
};

/**
 *  @override
 */
zz.ide.controllers.Services.prototype.setupModelInternal = function( ){

    this
        .getModel( )
        .createLast( [
            'Start SRV',
            'play_arrow',
            zz.ide.enums.DataAction.START_SRV,
            zz.ide.enums.CssClass.START_SERVER
        ] );
    this
        .getModel( )
        .createLast( [
            'Run DEV',
            'code',
            zz.ide.enums.DataAction.RUN_DEV,
            zz.ide.enums.CssClass.RUN_DEV
        ] );
    this
        .getModel( )
        .createLast( [
            'Run DBG',
            'bug_report',
            zz.ide.enums.DataAction.RUN_DBG,
            zz.ide.enums.CssClass.RUN_DBG
        ] );
    this
        .getModel( )
        .createLast( [
            'Run APP',
            'build',
            zz.ide.enums.DataAction.RUN_APP,
            zz.ide.enums.CssClass.RUN_APP
        ] );
    this
        .getModel( )
        .createLast( [
            'Run UT',
            'done_all',
            zz.ide.enums.DataAction.RUN_UT,
            zz.ide.enums.CssClass.RUN_UT
        ] );
};

/**
 *  @override
 */
zz.ide.controllers.Services.prototype.bootstrap = function( ){

    // this need for position popup if services render in popup
    //var parent = this.getParent( );
    //parent.getView( ).setSize( parent.getModel( ).lastDatarow( ).width, parent.getModel( ).lastDatarow( ).height );
    //parent.getView( ).setPosition( parent.getModel( ).lastDatarow( ).top, parent.getModel( ).lastDatarow( ).left );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Services.prototype.actionHandler_ = function( e ){

    //this.getLayout( ).closePopup( );

    if( this.getView( ).isActionStartSrv( e ) ){

        if( this.getModel( ).firstDatarow( ).icon === 'play_arrow' ){

            zz.ide.services.ClientApi.getInstance( ).startSrv( );

        }else if( this.getModel( ).firstDatarow( ).icon === 'stop' ){

            zz.ide.services.ClientApi.getInstance( ).stopSrv( );
        }

    }else if( this.getView( ).isActionRunDev( e ) ) {

        goog.window.open(

            'http://' + window[ 'SERVER_DEV' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
            { target: '_blank' }
        );

    }else if( this.getView( ).isActionRunDbg( e ) ) {

        goog.window.open(

            'http://' + window[ 'SERVER_TST' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
            { target: '_blank' }
        );

    }else if( this.getView( ).isActionRunApp( e ) ) {

        goog.window.open(

            'http://' + window[ 'SERVER_APP' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
            { target: '_blank' }
        );

    }else if( this.getView( ).isActionRunUt( e ) ) {

        goog.window.open(

            'http://' + window[ 'SERVER_UT' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
            { target: '_blank' }
        );

    }

    e.stopPropagation( );
};

/**
 * WS message event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Services.prototype.startSrvMessageHandler_ = function( e ){

    var messageModel =
        new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( messageModel.firstDatarow( ).stdout && messageModel.firstDatarow( ).stdout.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            messageModel

                .firstDatarow( )
                .stdout );
    }
    if( messageModel.firstDatarow( ).stderr && messageModel.firstDatarow( ).stderr.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            messageModel

                .firstDatarow( )
                .stderr );
    }else{

        this.getModel( ).firstDatarow( ).icon = 'stop';
        this.getModel( ).firstDatarow( ).name = zz.ide.enums.Const.STOP_SERVER;
    }

};

/**
 * WS message event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.Services.prototype.stopSrvMessageHandler_ = function( e ){

    var messageModel =
        new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( messageModel.firstDatarow( ).stdout && messageModel.firstDatarow( ).stdout.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            messageModel

                .firstDatarow( )
                .stdout );
    }
    if( messageModel.firstDatarow( ).stderr && messageModel.firstDatarow( ).stderr.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            messageModel

                .firstDatarow( )
                .stderr );
    }else{

        this.getModel( ).firstDatarow( ).icon = 'play_arrow';
        this.getModel( ).firstDatarow( ).name = zz.ide.enums.Const.START_SERVER;
    }
};