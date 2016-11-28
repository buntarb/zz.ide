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

goog.provide( 'zz.ide.services.DocApi' );

goog.require( 'goog.json' );
goog.require( 'goog.net.XhrIo' );
goog.require( 'goog.Promise' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.DocApi = function( ){

    goog.base( this );
};

goog.inherits( zz.ide.services.DocApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.DocApi );


/**
 * Get documentation file.
 * @return {goog.Promise} data
 */
zz.ide.services.DocApi.prototype.get = function( ){

    return ( new goog.Promise( function( resolve, reject ){

        goog.net.XhrIo.send( '/doc/searchMapDoc.json', function( ){

            var data = this.getResponseJson( );
            resolve( data );
        } );
    } ) );
};

/**
 * Get documentation data for injecting into model.
 * @return {Array}
 */
zz.ide.services.DocApi.prototype.getData = function( ){

    //this.get( )
    //
    //    .then( function( data ){
    //
    //        var dataJson = data;
    //        return dataJson;
    //        console.log( dataJson );
    //    } );

    return [

        'zz.ide.controllers.Header',
        'class',
        'Header controller.'
    ];
};






