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

goog.provide( 'zz.ide.controllers.BaseViewController' );


goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.controllers.FEBase' );

/**
 * Base view controller.
 * @param {zz.models.Dataset} model
 * @param {zz.views.FEBase} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.BaseViewController = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );

    this.wsc_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getWSClient( );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );

    this.layout_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( );
};

goog.inherits( zz.ide.controllers.BaseViewController, zz.controllers.FEBase );


/**
 * @override
 */
zz.ide.controllers.BaseViewController.prototype.setupListenersInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.BaseViewController.prototype.setupModelInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.BaseViewController.prototype.bootstrap = function( ){};

/**
 * Get router.
 * @return {zz.app.services.FEBaseRouter}
 */
zz.ide.controllers.BaseViewController.prototype.getRouter = function( ){

    return this.router_;
};

/**
 * Get websocket client.
 * @return {zz.net.WebSocketClient}
 */
zz.ide.controllers.BaseViewController.prototype.getWSClient = function( ){

    return this.wsc_;
};

/**
 * Get layout controller.
 * @return {zz.ide.controllers.Layout}
 */
zz.ide.controllers.BaseViewController.prototype.getLayout = function( ){

    return this.layout_;
};
