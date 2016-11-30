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

goog.require( 'zz.services.BaseService' );

goog.require( 'zz.ide.models.Documentation' );

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
 * Convert documentation data to documentation model.
 * @param {Array} data
 * @return {zz.ide.models.Documentation}
 * */
zz.ide.services.DocApi.prototype.getDocumentationModel = function( data ){

    var model = new zz.ide.models.Documentation( );
    model.createLast( [ data.longname, data.kind, data.description ] );
    return model;
};







