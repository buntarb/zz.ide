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
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.net.enums.MessageType' );
goog.require( 'zz.net.events.WebSocketClientMessage' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.ClientApi = function( ){

    goog.base( this );

    this.wsc_ = new zz.net.WebSocketClient( 'ws://localhost:7777' );

    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );
};

goog.inherits( zz.ide.services.ClientApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ClientApi );

/**
 * Open connection event handler.
 * @private
 */
zz.ide.services.ClientApi.prototype.openHandler_ = function( ){

    console.log( 'websocket open' );
};

/**
 * Receive message event handler.
 * @private
 */
zz.ide.services.ClientApi.prototype.messageHandler_ = function( input ){

    console.log( 'clientapi msg', input );
    this.dispatchEvent( new zz.net.events.WebSocketClientMessage( ) );
};

/**
 * Get data from server.
 */
zz.ide.services.ClientApi.prototype.getFiles = function( ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        'models',
        zz.ide.enums.Const.FOLDER,
        zz.ide.enums.Path.MODELS,
        ''
    ] );

    this.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );

    console.log("clientapi ends request");
};
