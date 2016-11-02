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
goog.require( 'zz.ide.controllers.Layout' );
goog.require( 'zz.ide.controllers.Filelist' );
goog.require( 'zz.ide.controllers.Ace' );
goog.require( 'zz.ide.controllers.Blankfolder' );


zz.ide.config = function( ){


    zz.app.services.FEBaseRouter.getInstance( )

        .when( '', zz.ide.controllers.Layout, zz.ide.controllers.Blankfolder, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/' );
        } )
        .when( '/', zz.ide.controllers.Layout, zz.ide.controllers.Blankfolder, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/' );
        } )
        .when( '/models/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/models' );
        } )
        .when( '/templates/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/templates' );
        } )
        .when( '/styles/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/styles' );
        } )
        .when( '/messages/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).zz.ide.controllers.Filelist( '/messages' );
        } )
        .when( '/resources/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/resources' );
        } )
        .when( '/controllers/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/controllers' );
        } )
        .when( '/enums/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/enums' );
        } )
        .when( '/errors/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/errors' );
        } )
        .when( '/events/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/events' );
        } )
        .when( '/factories/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/factories' );
        } )
        .when( '/services/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/services' );
        } )
        .when( '/views/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/views' );
        } )
        .when( '/tests/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/tests' );
        } )
        .when( '/index/', zz.ide.controllers.Layout, zz.ide.controllers.Filelist, function( ){

            zz.app.services.FEBaseRouter.getInstance( ).setFragment( '/index' );
        } )
        .when( '/models', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/templates', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/styles', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/messages', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/resources', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/controllers', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/enums', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/errors', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/events', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/factories', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/services', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/views', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/tests', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/index', zz.ide.controllers.Layout, zz.ide.controllers.Filelist )
        .when( '/models/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/templates/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/styles/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/messages/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/resources/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/controllers/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/enums/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/errors/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/events/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/factories/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/services/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/tests/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/index/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .when( '/?file=:file', zz.ide.controllers.Layout, zz.ide.controllers.Ace )
        .otherwise( '/error' );
};