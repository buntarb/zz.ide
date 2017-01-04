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

goog.provide( 'zz.ide.services.ConvertConstants' );

goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.CssClass' );

goog.require( 'zz.services.BaseService' );

/**
 * Service for converting constants.
 * @constructor
 */
zz.ide.services.ConvertConstants = function( ){

    goog.base( this, 'zz.ide.services.ConvertConstants' );
};

goog.inherits( zz.ide.services.ConvertConstants, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ConvertConstants );


/**
 * Get path from route
 * @param {string} route
 * @return {string}
 */
zz.ide.services.ConvertConstants.prototype.getPathFromRoute = function( route ){

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


/**
 * Get icon from route
 * @param {string} route
 * @return {string}
 */
zz.ide.services.ConvertConstants.prototype.getIconFromRoute = function( route ){

    var icon;
    if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.MODELS, 'g' ), route ) ){

        icon = zz.ide.enums.Const.ICON_MODELS;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.TEMPLATES, 'g' ), route ) ){

        icon = zz.ide.enums.Const.ICON_TEMPLATES;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.STYLES, 'g' ), route ) ){

        icon = zz.ide.enums.Const.ICON_STYLES;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.MESSAGES, 'g' ), route ) ){

        icon = zz.ide.enums.Const.ICON_MESSAGES;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.CONTROLLERS, 'g' ), route )

        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.ENUMS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.ERRORS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.EVENTS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.FACTORIES, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.VIEWS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.TESTS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.INDEX, 'g' ), route ) ){

        icon = zz.ide.enums.Const.ICON_FOLDER;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.BASE_JS, 'g' ), route )

        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.PACKAGE_JSON, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.CONFIG_YAML, 'g' ), route ) ){

        icon = zz.ide.enums.Const.ICON_FILE;
    }
    return icon;
};

/**
 * Get class from route
 * @param {string} route
 * @return {string}
 */
zz.ide.services.ConvertConstants.prototype.getClassFromRoute = function( route ){

    var cssClass;
    if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.MODELS, 'g' ), route ) ){

        cssClass = zz.ide.enums.CssClass.ICON_MODELS;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.TEMPLATES, 'g' ), route ) ){

        cssClass = zz.ide.enums.CssClass.ICON_TEMPLATES;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.STYLES, 'g' ), route ) ){

        cssClass = zz.ide.enums.CssClass.ICON_STYLES;

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.MESSAGES, 'g' ), route ) ){

        cssClass = '';

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.CONTROLLERS, 'g' ), route )

        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.ENUMS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.ERRORS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.EVENTS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.FACTORIES, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.VIEWS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.TESTS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.INDEX, 'g' ), route ) ){

        cssClass = '';

    }else if( goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.BASE_JS, 'g' ), route )

        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.PACKAGE_JSON, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.CONFIG_YAML, 'g' ), route ) ){

        cssClass = '';
    }
    return cssClass;
};







