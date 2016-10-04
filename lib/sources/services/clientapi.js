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

goog.provide( 'zz.ide.services.ClientApi' );

goog.require( 'zz.services.BaseService' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.ClientApi = function( ){

    goog.base( this );
};

goog.inherits( zz.ide.services.ClientApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ClientApi );

/**
 * Get data from server.
 * @param {zz.ide.models.Navigation} model
 */
zz.ide.services.ClientApi.prototype.getData = function( model ){

    model.createLast( [ 'root folder', 'folder' ] );
    model.createLast( [ 'root file', 'file' ] );
};

/**
 * Upgrade model for UI.
 */
zz.ide.services.ClientApi.prototype.upgradeModel = function( serverModel, uiModel ){

    goog.array.forEach( serverModel, function( serverModelDatarow ){

        uiModel.createLast(

            [
                serverModelDatarow.title,
                serverModelDatarow.type,
                serverModelDatarow.path,
                serverModelDatarow.content,
                serverModelDatarow.count,
                undefined
            ]
        );
    });
};