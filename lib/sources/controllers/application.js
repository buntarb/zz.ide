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

goog.provide( 'zz.ide.controllers.Application' );

goog.require( 'zz.app.controllers.FERootController' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.app.services.FERouter' );

/**
 * Application controller.
 * @param {zz.ide.models.Application} model
 * @param {zz.ide.views.Application} view
 * @param opt_dom
 * @constructor
 * @extends {zz.app.controllers.FERootController}
 */
zz.ide.controllers.Application = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    var wssUrl = 'ws://'

        +  window[ 'WS_SERVER_HOST' ]
        + ':'
        + window[ 'WS_SERVER_PORT' ]
        + window[ 'WS_SERVER_PATH' ];
    this.wsc_ = new zz.net.WebSocketClient( wssUrl );
    this.router_ = zz.app.services.FERouter.getInstance( );
};
goog.inherits(
    zz.ide.controllers.Application,
    zz.app.controllers.FERootController );

/**
 *  @override
 */
zz.ide.controllers.Application.prototype.setupListenersInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.Application.prototype.setupModelInternal = function( ){};


/**
 * Get web socket client.
 * @return {zz.net.WebSocketClient}
 */
zz.ide.controllers.Application.prototype.getWSClient = function( ){

    return this.wsc_;
};

/**
 * Get router.
 * @return {zz.app.services.FERouter}
 */
zz.ide.controllers.Application.prototype.getRouter = function( ){

    return this.router_;
};

/**
 * Return application layout.
 * @return {zz.app.controllers.FELayout}
 */
zz.ide.controllers.Application.prototype.getLayoutController = function( ){

    return this.getChildAt( 0 );
};


/**
 * Get layout wrapper.
 * @return {Element}
 */
zz.ide.controllers.Application.prototype.getLayoutWrapper = function( ){

    return goog.dom.getElementByClass( zz.app.enums.CssClass.LAYOUT_WRAPPER );
};


