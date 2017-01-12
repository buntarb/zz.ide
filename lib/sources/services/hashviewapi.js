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

goog.provide( 'zz.ide.services.HashViewApi' );

goog.require( 'goog.array' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for hashView api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.HashViewApi = function( ){

    goog.base( this, 'zz.ide.services.HashViewApi' );

    this.layout_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );
};

goog.inherits( zz.ide.services.HashViewApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.HashViewApi );

/**
 *  Remove controller from  hash of view controllers
 *  @param {string} route
 */
zz.ide.services.HashViewApi.prototype.removeCtrlFromHashView = function( route ){

    this.removeElementFromHashView( route );
    if(  this.getCtrlFromHashView( route ).isCurrRoute( ) ){

        this.router_.setFragment( this.layout_.getHashView( )[ this.hashView_.length - 1 ] );
        this.closePopup( );
    }
    this.getCtrlFromHashView( route ).disposeInternal( );
};

/**
 *  Remove element by route from hashView.
 *  @param {string} route
 */
zz.ide.services.HashViewApi.prototype.removeElementFromHashView = function( route ){

    var i = 0;
    goog.array.forEach( this.layout_.getHashView( ), function( item ){

        if( item.route === route ){

            goog.array.splice( this.layout_.getHashView( ), i, 1 );
        }
        i++;
    });
};

/**
 *  Get controller by route from hashView.
 *  @param {string} route
 *  @return {zz.ide.controllers.BaseViewController|boolean}
 *
 */
zz.ide.services.HashViewApi.prototype.getCtrlFromHashView = function( route ){

    var controller;
    goog.array.forEach( this.layout_.getHashView( ), function( item ){

        if( item.route === route ){

            controller = item.controller;
        }
    });
    return controller ? controller : false;
};

/**
 *  Get array of ace view controllers from hashView.
 *  @return {Array}
 */
zz.ide.services.HashViewApi.prototype.getHashFileView = function( ){

    var hashView = this.layout_.getHashView( );
    var hashViewFile = [];

    goog.array.forEach( hashView, function( item ){

        if( goog.dom.pattern.matchStringOrRegex( /file=/g, item.route ) ){

            hashViewFile[ hashViewFile.length ] = {

                'route': item.route,
                'controller': item.controller
            };
        }
    } );

    return hashViewFile;
};

/**
 *  Return true or false if history button on the ace header is had to show or hide.
 *  @return {boolean}
 */
zz.ide.services.HashViewApi.prototype.displayHistoryStatus = function( ){

    return this.getHashFileView( ).length > 3
};


