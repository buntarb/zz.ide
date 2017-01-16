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

goog.provide( 'zz.ide.services.ViewStackApi' );

goog.require( 'goog.array' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for view stack api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.ViewStackApi = function( ){

    goog.base( this, 'zz.ide.services.ViewStackApi' );
    this.viewStack_ = [];

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );
};

goog.inherits( zz.ide.services.ViewStackApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ViewStackApi );

/**
 *  Get stack of view controllers.
 *  @return {Array}
 */
zz.ide.services.ViewStackApi.prototype.getViewStack= function( ){

    return this.viewStack_;
};

/**
 *  Push element to the view stack.
 *  @param {string} route
 *  @param {zz.ide.controllers.Ace} controller
 */
zz.ide.services.ViewStackApi.prototype.pushToViewStack = function( route, controller ){

    this.viewStack_[ this.viewStack_.length ] = {

        route: route,
        controller: controller
    }
};

/**
 *  Dispose controller from  stack of view controllers
 *  @param {string} route
 */
zz.ide.services.ViewStackApi.prototype.disposeCtrlFromViewStack = function( route ){

    if( this.getCtrlFromViewStack( route ).isCurrRoute( ) ){

        this.router_.setFragment( this.viewStack_[ this.viewStack_.length - 1 ] );
        zz.environment.services.Environment.getInstance( )

            .getRootController( )
            .getLayoutController( )
            .closePopup( );
    }

    this.getCtrlFromViewStack( route ).disposeInternal( );
    this.removeElementFromViewStack( route );
};

/**
 *  Remove element by route from ViewStack.
 *  @param {string} route
 */
zz.ide.services.ViewStackApi.prototype.removeElementFromViewStack = function( route ){

    var i = 0;
    var self = this;
    goog.array.forEach( this.viewStack_, function( item ){

        if( item.route === route ){

            goog.array.splice( self.viewStack_, i, 1 );
        }
        i++;
    });
};

/**
 *  Get controller by route from ViewStack.
 *  @param {string} route
 *  @return {zz.ide.controllers.BaseViewController|boolean}
 *
 */
zz.ide.services.ViewStackApi.prototype.getCtrlFromViewStack = function( route ){

    var controller;
    goog.array.forEach( this.viewStack_, function( item ){

        if( item.route === route ){

            controller = item.controller;
        }
    });
    return controller ? controller : false;
};

/**
 *  Get array of ace view controllers from ViewStack.
 *  @return {Array}
 */
zz.ide.services.ViewStackApi.prototype.getViewStackFile = function( ){

    return goog.array.filter( this.viewStack_, function( item ){

            return goog.dom.pattern.matchStringOrRegex( /file=/g, item.route );
        }
    );
};

/**
 *  Return true or false if history button on the ace header is had to show or hide.
 *  @return {boolean}
 */
zz.ide.services.ViewStackApi.prototype.displayHistoryStatus = function( ){

    return this.getViewStackFile( ).length > 3
};


