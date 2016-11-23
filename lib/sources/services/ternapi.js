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

goog.provide( 'zz.ide.services.TernApi' );

goog.require( 'goog.json' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.ide.models.TernRequest' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.TernApi = function( ){

    goog.base( this );
    this.wsc_ = zz.environment.services.Environment.getInstance( ).getRootController( ).getWSClient( );
};

goog.inherits( zz.ide.services.TernApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.TernApi );


/**
 * Get completion.
 * @param {Object} query
 */
zz.ide.services.TernApi.prototype.get = function( query ){

    var ternModel = new zz.ide.models.TernRequest( );

    ternModel.createLast( [ goog.json.serialize( query ) ] );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.TERN_REQUEST, ternModel );
    console.log( zz.ide.enums.Command.TERN_REQUEST, ternModel );
};







