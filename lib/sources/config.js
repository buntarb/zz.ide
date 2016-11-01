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

goog.provide( 'zz.ide.config' );

goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.app.services.FEBaseRouter' );


zz.ide.config = function( ){


    zz.app.services.FEBaseRouter.getInstance( )

        .when( '', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/' );
        } )
        .when( '/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/' );
        } )
        .when( '/models/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/models' );
        } )
        .when( '/templates/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/templates' );
        } )
        .when( '/styles/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/styles' );
        } )
        .when( '/messages/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/messages' );
        } )
        .when( '/resources/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/resources' );
        } )
        .when( '/controllers/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/controllers' );
        } )
        .when( '/enums/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/enums' );
        } )
        .when( '/errors/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/errors' );
        } )
        .when( '/events/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/events' );
        } )
        .when( '/factories/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/factories' );
        } )
        .when( '/services/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/services' );
        } )
        .when( '/views/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/views' );
        } )
        .when( '/tests/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/tests' );
        } )
        .when( '/index/', undefined, undefined, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/index' );
        } )
        .when( '/models', undefined, undefined )
        .when( '/models/?file=:file', undefined, undefined )
        .otherwise( '/error' );
};