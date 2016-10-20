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

goog.provide( 'zz.ide.services.ClientApi' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.net.WebSocketClient' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.ClientApi = function( ){

    goog.base( this );

    //this.wsc_ = zz.environment.services.Environment.getInstance( ).getWsClient( );
    this.wsс_ = new zz.net.WebSocketClient( 'ws://localhost:7777' );

    this.eventHandler_ = new goog.events.EventHandler( );

    this.eventHandler_.listenWithScope(

        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openHandler_,
        false,
        this
    );
};

goog.inherits( zz.ide.services.ClientApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ClientApi );


/**
 * Get data from server.
 * @param {zz.ide.models.NavigationDatarow} datarow
 */
zz.ide.services.ClientApi.prototype.getFiles = function( datarow ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        datarow.name,
        datarow.type,
        datarow.path,
        ''
    ] );

    if( datarow.type === zz.ide.enums.Const.FOLDER ){

        this.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );

    }else{

        this.wsc_.sendCommandMessage( zz.ide.enums.Command.OPEN_FILE, model );
    }
};

/**
 * Save file to server.
 * @param {zz.ide.models.Ace} datarow
 */
zz.ide.services.ClientApi.prototype.saveFile = function( datarow ){

    console.log( 'websocket save' );

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        datarow.name,
        datarow.type,
        datarow.path,
        datarow.content
    ] );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.SAVE_FILE, model );
};

/**
 * Open connection event handler.
 * @private
 */
zz.ide.services.ClientApi.prototype.openHandler_ = function( ){};

/**
 * Get ws client.
 * @return {zz.net.WebSocketClient} this.ws_
 */
zz.ide.services.ClientApi.prototype.getWsClient = function( ){

    return this.ws_;
};


