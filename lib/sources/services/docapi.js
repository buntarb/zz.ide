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
goog.require( 'zz.ide.models.DocumentationValue' );

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
 * Convert documentation data to documentation model for classes.
 * @param {Array} data
 * @return {zz.ide.models.Documentation|boolean}
 * */
zz.ide.services.DocApi.prototype.getDocumentationModel = function( data ){

    console.log( data );

    var isClass = false;
    var model = new zz.ide.models.Documentation( );
    var dataMethod = this.getDocumentationDataMethod( data );
    var dataValue = this.getDocumentationDataValue( data );
    var modelMethod = new zz.ide.models.DocumentationMethod( );
    var modelValue = new zz.ide.models.DocumentationValue( );
    goog.array.forEach( data, function( dataItem ){

        if( dataItem.kind === 'class' ){

            model.createLast( [

                dataItem.longname,
                dataItem.kind,
                dataItem.description,
                dataItem.meta.path + dataItem.meta.filename,
                modelMethod,
                modelValue
            ] );
            isClass = true;
        }
    } );

    goog.array.forEach( dataMethod, function( item ){

        modelMethod.lastDatarow( ).method.createLast( [ item ] );
    });
    goog.array.forEach( dataValue, function( item ){

        modelValue.lastDatarow( ).method.createLast( [ item ] );
    });
    return isClass ? model : isClass;
};

/**
 * Convert documentation data to documentation model for methods.
 * @param {Array} data
 * @return {Array}
 * */
zz.ide.services.DocApi.prototype.getDocumentationDataMethod = function( data ){

    var isMethod = false;
    var dataMethod = [];
    goog.array.forEach( data, function( item ){

        if( item.kind === 'function' ){

           // model.createLast( [ dataItem.longname ] );
            dataMethod.push( item.longname );
            isMethod = true;
        }
    } );

    return dataMethod;
};

/**
 * Convert documentation data to documentation model for values
 * @param {Array} data
 * @return {Array}
 * */
zz.ide.services.DocApi.prototype.getDocumentationDataValue = function( data ){

    var dataValue = [ ];
    goog.array.forEach( data, function( item ){

        if( item.kind === 'member' ){

            //model.createLast( [ dataItem.longname ] );
            dataValue.push( item.longname );
        }
    } );

    return dataValue;
};






