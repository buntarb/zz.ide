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

goog.provide( 'zz.ide.controllers.ServerServices' );

goog.require( 'goog.window' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.models.WebServerRunner' );
goog.require( 'zz.ui.controllers.List' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.enums.DataAction' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ui.enums.EventType' );

goog.require( 'zz.ide.views.Services' );

/**
 * Services controller.
 * @param {zz.ide.models.Services} model
 * @param {zz.ide.views.Services} view
 * @constructor
 * @extends {zz.ui.controllers.List}
 */

zz.ide.controllers.ServerServices  = class extends zz.ui.controllers.List {

    /**
     * @param {zz.ui.models.List} model
     * @param {zz.ui.views.List} view
     */
    constructor( model, view ){

        view = view || zz.ide.views.Services.getInstance( );

        super( model, view );
        this.wsc_ = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getWSClient( );

        this.layout_ = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( );
    }

    setupListenersInternal( ){

        super.setupListenersInternal( );

        this.getHandler( ).listen(

            this,
            zz.ui.enums.EventType.LIST_ITEM_ACTION,
            this.actionHandler_,
            false
        );

        if( !this.wsc_.isReady( ) ){

            this.getHandler( ).listenWithScope(

                this.wsc_,
                zz.net.enums.EventType.WEB_SOCKET_READY,
                zz.ide.services.ClientApi.getInstance( ).checkSrvStatus,
                false,
                zz.ide.services.ClientApi.getInstance( )
            );
        }

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
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.IS_SERVER_RUNNING,
            this.checkSrvStatusMessageHandler_,
            false,
            this
        );

        this.getHandler( ).listenWithScope(

            this,
            zz.controllers.enums.EventType.LEAVE,
            this.leaveHandler_,
            false,
            this
        );

        this.getHandler( ).listenWithScope(

            this,
            zz.controllers.enums.EventType.ENTER,
            this.enterHandler_,
            false,
            this
        );
    };
};

zz.environment.services.MVCRegistry.setController( 'serverServices', zz.ide.controllers.ServerServices );

/**
 *  @override
 */
zz.ide.controllers.ServerServices.prototype.setupModelInternal = function( ){

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.START_SERVER,
            zz.ide.enums.CssClass.START_SERVER,
            false,
            false,
            zz.ide.enums.Const.ICON_START,
            'Start server',
            undefined
        ] );
    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.RUN_DEV,
            zz.ide.enums.CssClass.RUN_DEV,
            false,
            false,
            zz.ide.enums.Const.ICON_DEV,
            'Run dev',
            undefined
        ] );
    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.RUN_DBG,
            zz.ide.enums.CssClass.RUN_DBG,
            false,
            false,
            zz.ide.enums.Const.ICON_BUG,
            'Run DBG',
            undefined
        ] );
    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.RUN_APP,
            zz.ide.enums.CssClass.RUN_APP,
            false,
            false,
            zz.ide.enums.Const.ICON_BUILD,
            'Run APP',
            undefined
        ] );
    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.RUN_UT,
            zz.ide.enums.CssClass.RUN_UT,
            false,
            false,
            zz.ide.enums.Const.ICON_UT,
            'Run UT',
            undefined
        ] );
};

/**
 *  @override
 */
zz.ide.controllers.ServerServices.prototype.bootstrap = function( ){

    this.getView( ).addSelector( this, zz.ide.enums.CssClass.SERVER_SERVICES );

    if( this.wsc_.isReady( ) ){

        zz.ide.services.ClientApi.getInstance( ).checkSrvStatus( );
    }
};

/**
 * @override
 */
zz.ide.controllers.ServerServices.prototype.datarowUpdateHandler = function( e ){

    e.stopPropagation( );
};

/**
 * Action event handler.
 * @param {zz.ui.enums.EventType.LIST_ITEM_ACTION} e
 * @private
 */
zz.ide.controllers.ServerServices.prototype.actionHandler_ = function( e ){

    switch( e.model.id ){

        case zz.ide.enums.CssClass.START_SERVER:

            if( e.model.icon === zz.ide.enums.Const.ICON_START ){

                zz.ide.services.ClientApi.getInstance( ).startSrv( );

            }else if( e.model.icon === zz.ide.enums.Const.ICON_STOP ){

                zz.ide.services.ClientApi.getInstance( ).stopSrv( );
            }

            break;

        case zz.ide.enums.CssClass.RUN_DEV:

            goog.window.open(

                'http://' + window[ 'SERVER_DEV' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
                { target: '_blank' }
            );

            break;

        case zz.ide.enums.CssClass.RUN_DBG:

            goog.window.open(

                'http://' + window[ 'SERVER_TST' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
                { target: '_blank' }
            );

            break;

        case zz.ide.enums.CssClass.RUN_APP:

            goog.window.open(

                'http://' + window[ 'SERVER_APP' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
                { target: '_blank' }
            );

            break;

        case zz.ide.enums.CssClass.RUN_UT:

            goog.window.open(

                'http://' + window[ 'SERVER_UT' ] + '.' + window[ 'SERVER_DOMAIN' ] + ':' + window[ 'SERVER_PORT' ],
                { target: '_blank' }
            );

            break;
    }

    e.stopPropagation( );
};

/**
 * WS message event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.ServerServices.prototype.startSrvMessageHandler_ = function( e ){

    var messageModel =
        new zz.ide.models.WebServerRunner( undefined, e.getDataJson( ) );

    if( messageModel.firstDatarow( ).stdout && messageModel.firstDatarow( ).stdout.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            undefined,
            undefined,
            undefined,
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
            undefined,
            undefined,
            undefined,
            messageModel

                .firstDatarow( )
                .stderr );
    }else{

        this.getModel( ).firstDatarow( ).icon = zz.ide.enums.Const.ICON_STOP;
        this.getModel( ).firstDatarow( ).capture = 'Stop server';
    }

};

/**
 * WS message event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.ServerServices.prototype.stopSrvMessageHandler_ = function( e ){

    var messageModel =
        new zz.ide.models.WebServerRunner( undefined, e.getDataJson( ) );

    if( messageModel.firstDatarow( ).stdout && messageModel.firstDatarow( ).stdout.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            undefined,
            undefined,
            undefined,
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
            undefined,
            undefined,
            undefined,
            messageModel

                .firstDatarow( )
                .stderr );
    }else{

        this.getModel( ).firstDatarow( ).icon = zz.ide.enums.Const.ICON_START;
        this.getModel( ).firstDatarow( ).capture = 'Start server';
    }
};

/**
 * Mouse enter event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.ServerServices.prototype.enterHandler_ = function( e ){

    if( e.model.id === zz.ide.enums.CssClass.START_SERVER  ){

        goog.dom.classlist.remove( e.elements[ 0 ], zz.ide.enums.CssClass.BLUR );
    }
    e.stopPropagation( );
};

/**
 * Mouse leave event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.ServerServices.prototype.leaveHandler_ = function( e ){

    if( e.model.id === zz.ide.enums.CssClass.START_SERVER  ){

        goog.dom.classlist.add( e.elements[ 0 ], zz.ide.enums.CssClass.BLUR );
    }
    e.stopPropagation( );
};

/**
 * Check server status event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.ServerServices.prototype.checkSrvStatusMessageHandler_ = function( e ){

    var serverModel = new zz.ide.models.WebServerRunner( undefined, e.getDataJson( ) );

    var model = this.getModel( );

    var startSrvDatarow;
    if( model.firstDatarow( ) ){

        var loop = true;
        while( loop ){

            if( model.currentDatarow( ).id === zz.ide.enums.CssClass.START_SERVER ){

                startSrvDatarow = model.currentDatarow( );
                loop = false;

            }else{

                model.nextDatarow( );
            }
        }
    }

    if( serverModel.lastDatarow().isrunning ){

        startSrvDatarow.icon = zz.ide.enums.Const.ICON_STOP;

    }else{
        
        startSrvDatarow.icon = zz.ide.enums.Const.ICON_START;
    }
    e.stopPropagation( );
};
