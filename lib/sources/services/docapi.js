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
goog.require( 'zz.ide.models.DocumentationMethod' );
goog.require( 'zz.ide.models.DocumentationProperty' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.DocApi = function( ){

    goog.base( this, 'zz.ide.services.DocApi' );
};
goog.inherits( zz.ide.services.DocApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.DocApi );


/**
 * Convert documentation data to documentation model for classes.
 * @param {Array} data
 * @return {zz.ide.models.Documentation|boolean}
 **/
zz.ide.services.DocApi.prototype.getDocumentationModel = function( data ){

    var isClass = false;
    var classModel = new zz.ide.models.Documentation( );
    var delimiter;

        if( zz.environment.services.Environment.getInstance( ).os.isWindows( ) ){

            delimiter = '\\';

        }else{

            delimiter = '/';
        }
    goog.array.forEach( data, function( dataItem ){

        if( dataItem[ 'kind' ] === 'class' ){

            isClass = true;
            classModel.createLast( [

                dataItem[ 'longname' ],
                dataItem[ 'kind' ],
                dataItem[ 'description' ],
                dataItem[ 'meta' ][ 'path' ] + delimiter + dataItem[ 'meta' ][ 'filename' ]
            ] );
            this.getDocumentationModelMethod(

                classModel.lastDatarow( ).method,
                data );
            this.getDocumentationModelProperty(

                classModel.lastDatarow( ).property,
                data );
        }
    }, this );
    return isClass ? classModel : isClass;
};

/**
 * Convert documentation data to documentation model for methods.
 * @param {zz.ide.models.DocumentationMethod} model
 * @param {Array} data
 * @return {zz.ide.models.DocumentationMethod}
 * */
zz.ide.services.DocApi.prototype.getDocumentationModelMethod = function( model, data ){

    goog.array.forEach( data, function( dataItem ){

        if( dataItem[ 'kind' ] === 'function' ){

            model.createLast( [ dataItem[ 'name' ] ] );
        }
    } );
    return model;
};

/**
 * Convert documentation data to documentation model for properties
 * @param {zz.ide.models.DocumentationProperty} model
 * @param {Array} data
 * @return {zz.ide.models.DocumentationProperty}
 * */
zz.ide.services.DocApi.prototype.getDocumentationModelProperty = function( model, data ){

    goog.array.forEach( data, function( dataItem ){

        if( dataItem[ 'kind' ] === 'member' ){

            model.createLast( [ dataItem[ 'name' ] ] );
        }
    } );
    return model;
};
