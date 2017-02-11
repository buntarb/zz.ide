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
goog.require( 'zz.ide.enums.Types' );
goog.require( 'zz.ide.enums.TypeLinks' );
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
 * @param {string} search
 * @return {Object}
 **/
zz.ide.services.DocApi.prototype.getDocumentationModel = function( data, search ){

    var classModel = new zz.ide.models.Documentation( );
    var delimiter = '/';
    var isSupported = false;

        //if( zz.environment.services.Environment.getInstance( ).os.isWindows( ) ){
        //
        //    delimiter = '\\';
        //
        //}else{
        //
        //    delimiter = '/';
        //}
    goog.array.forEach( data, function( dataItem ){

        if( dataItem[ 'longname' ] === search && dataItem[ 'kind' ] === 'class' ){

            classModel.createLast( [

                dataItem[ 'longname' ],
                dataItem[ 'kind' ],
                dataItem[ 'description' ],
                dataItem[ 'meta' ][ 'path' ] + delimiter + dataItem[ 'meta' ][ 'filename' ],
                dataItem[ 'augments' ][ 0 ]
            ] );
            this.getDocumentationModelMethod(

                classModel.lastDatarow( ).method,
                data );

            this.getDocumentationModelProperty(

                classModel.lastDatarow( ).property,
                data );

            this.getDocumentationModelParams(

                classModel.lastDatarow( ).params,
                dataItem );

            isSupported = true;
        }
    }, this );

    if( !isSupported ){

        classModel.createLast( [

            'This type is not supported yet.'
        ] );
    }
    return {

        model: classModel,
        isSupported: isSupported
    };
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


/**
 * Convert documentation data to documentation model for params
 * @param {zz.ide.models.DocumentationParams} model
 * @param {Array} data
 * @return {zz.ide.models.DocumentationParams}
 * */
zz.ide.services.DocApi.prototype.getDocumentationModelParams = function( model, data ){

    var self = this;
    goog.array.forEach( data[ 'params' ], function( paramItem ){

        model.createLast( [ paramItem[ 'name' ] ] );
        if( paramItem[ 'type' ] ){

            self.getDocumentationModelParamsType( model.currentDatarow( ).type, paramItem );
        }
    } );
    return model;
};

/**
 * Convert params data to documentation model for param types
 * @param {zz.ide.models.DocumentationParamsType} model
 * @param {Array} paramsData
 * @return {zz.ide.models.DocumentationParamsType}
 * */
zz.ide.services.DocApi.prototype.getDocumentationModelParamsType = function( model, paramsData ){

    goog.array.forEach( paramsData[ 'type' ][ 'names' ], function( typeName ){

        var link;
        switch( typeName ){

            case zz.ide.enums.Types.STRING:

                link = zz.ide.enums.TypeLinks.STRING;

                break;

            case zz.ide.enums.Types.NUMBER:

                link = zz.ide.enums.TypeLinks.NUMBER;

                break;

            case zz.ide.enums.Types.BOOLEAN:

                link = zz.ide.enums.TypeLinks.BOOLEAN;

                break;

            case zz.ide.enums.Types.ARRAY:

                link = zz.ide.enums.TypeLinks.ARRAY;

                break;

            case zz.ide.enums.Types.OBJECT:

                link = zz.ide.enums.TypeLinks.OBJECT;

                break;

            case zz.ide.enums.Types.FUNCTION:

                link = zz.ide.enums.TypeLinks.FUNCTION;

                break;
        }
        model.createLast( [ typeName, link ] );
    } );
    return model;
};
