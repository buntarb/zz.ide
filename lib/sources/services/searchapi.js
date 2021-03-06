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

goog.provide( 'zz.ide.services.SearchApi' );

goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.services.BaseService' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.models.JSDocQuery' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.SearchApi = function( ){

    goog.base( this, 'zz.ide.services.SearchApi' );
    this.wsc_ = zz.environment.services.Environment
        .getInstance( )
        .getRootController( )
        .getWSClient( );
};

goog.inherits( zz.ide.services.SearchApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.SearchApi );


/**
 * Send search query autocomplite.
 * @param {string} query
 * */
zz.ide.services.SearchApi.prototype.askKeywords = function( query ){

    var jsdocModel = new zz.ide.models.JSDocQuery( );
    jsdocModel.createLast( [ query ] );
    this.wsc_.sendCommandMessage(
        zz.ide.enums.Command.JSDOC_KEYWORDS,
        jsdocModel );
};

/**
 * Send search query.
 * @param {string} query
 * */
zz.ide.services.SearchApi.prototype.askDefinitions = function( query ){

    var jsdocModel = new zz.ide.models.JSDocQuery( );
    jsdocModel.createLast( [ query ] );
    this.wsc_.sendCommandMessage(
        zz.ide.enums.Command.JSDOC_DEFINITIONS,
        jsdocModel );
};







