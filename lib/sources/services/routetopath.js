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

goog.provide( 'zz.ide.services.RouteToPath' );

goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.services.BaseService' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.RouteToPath = function( ){

    goog.base( this, 'zz.ide.services.RouteToPath' );
};

goog.inherits( zz.ide.services.RouteToPath, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.RouteToPath );


/**
 * Get path from route
 * @param {string} route
 * @return {string}
 */
zz.ide.services.RouteToPath.prototype.getPath = function( route ){

    var path;
    switch( route ){

        case zz.ide.enums.Route.MODELS:

            path = zz.ide.enums.Path.MODELS;
            break;

        case zz.ide.enums.Route.TEMPLATES:

            path = zz.ide.enums.Path.TEMPLATES;
            break;

        case zz.ide.enums.Route.STYLES:

            path = zz.ide.enums.Path.STYLES;
            break;

        case zz.ide.enums.Route.MESSAGES:

            path = zz.ide.enums.Path.MESSAGES;
            break;

        case zz.ide.enums.Route.RESOURCES:

            path = zz.ide.enums.Path.RESOURCES;
            break;

        case zz.ide.enums.Route.CONTROLLERS:

            path = zz.ide.enums.Path.CONTROLLERS;
            break;

        case zz.ide.enums.Route.ENUMS:

            path = zz.ide.enums.Path.ENUMS;
            break;

        case zz.ide.enums.Route.ERRORS:

            path = zz.ide.enums.Path.ERRORS;
            break;

        case zz.ide.enums.Route.EVENTS:

            path = zz.ide.enums.Path.EVENTS;
            break;

        case zz.ide.enums.Route.FACTORIES:

            path = zz.ide.enums.Path.FACTORIES;
            break;

        case zz.ide.enums.Route.SERVICES:

            path = zz.ide.enums.Path.SERVICES;
            break;

        case zz.ide.enums.Route.VIEWS:

            path = zz.ide.enums.Path.VIEWS;
            break;

        case zz.ide.enums.Route.TESTS:

            path = zz.ide.enums.Path.TESTS;
            break;

        case zz.ide.enums.Route.INDEX:

            path = zz.ide.enums.Path.INDEX;
            break;

        case zz.ide.enums.Route.BASE_JS:
        
            path = zz.ide.enums.Path.BASE_JS;
            break;

        case zz.ide.enums.Route.PACKAGE_JSON:

            path = zz.ide.enums.Path.PACKAGE_JSON;
            break;

        case zz.ide.enums.Route.CONFIG_YAML:

            path = zz.ide.enums.Path.CONFIG_YAML;
            break;
    }
    return path;
};







