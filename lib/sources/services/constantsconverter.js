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

goog.provide( 'zz.ide.services.ConstantsConverter' );

goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Route' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.Command' );

goog.require( 'zz.services.BaseService' );

/**
 * Service for converting constants.
 * @constructor
 */
zz.ide.services.ConstantsConverter = function( ){

    goog.base( this, 'zz.ide.services.ConstantsConverter' );
};

goog.inherits( zz.ide.services.ConstantsConverter, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ConstantsConverter );


/**
 * Get path from route
 * @param {string} route
 * @return {string}
 */
zz.ide.services.ConstantsConverter.prototype.getPathFromRoute = function( route ){

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
zz.ide.services.ConstantsConverter.prototype.getIconFromRoute = function( route ){

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
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.SERVICES, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.VIEWS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.TESTS, 'g' ), route )
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.INDEX, 'g' ), route ) ){

        if( goog.dom.pattern.matchStringOrRegex( new RegExp( 'file=', 'g' ), route ) ){

            icon = zz.ide.enums.Const.ICON_FILE;
        }else{

            icon = zz.ide.enums.Const.ICON_FOLDER;
        }

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
zz.ide.services.ConstantsConverter.prototype.getClassFromRoute = function( route ){

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
        || goog.dom.pattern.matchStringOrRegex( new RegExp( zz.ide.enums.Route.SERVICES, 'g' ), route )
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


/**
 * Get icon for listitem from listitem id
 * @param {string} id
 * @return {string}
 */
zz.ide.services.ConstantsConverter.prototype.getIconFromId = function( id ) {

    var icon;
    switch( id ){

        case zz.ide.enums.CssClass.COMPILE_APP:

            icon = zz.ide.enums.Const.ICON_BUILD;

            break;

        case zz.ide.enums.CssClass.COMPILE_MODELS:

            icon = zz.ide.enums.Const.ICON_MODELS;

            break;

        case zz.ide.enums.CssClass.COMPILE_SOY:

            icon = zz.ide.enums.Const.ICON_TEMPLATES;

            break;

        case zz.ide.enums.CssClass.COMPILE_CSS:

            icon = zz.ide.enums.Const.ICON_STYLES;

            break;

        case zz.ide.enums.CssClass.CALC_DEPS:

            icon = zz.ide.enums.Const.ICON_FOLDER;

            break;

        case zz.ide.enums.CssClass.EXTRACT_MSG:

            icon = zz.ide.enums.Const.ICON_MESSAGES;

            break;
    }
    return icon;
};

/**
 * Get command for server from listitem id
 * @param {string} id
 * @return {string}
 */
zz.ide.services.ConstantsConverter.prototype.getCommandFromId = function( id ){

    var command;

    switch( id ){

        case zz.ide.enums.CssClass.COMPILE_APP:

            command = zz.ide.enums.Command.COMPILE_APP;

            break;

        case zz.ide.enums.CssClass.COMPILE_SOY:

            command = zz.ide.enums.Command.COMPILE_SOY;

            break;

        case zz.ide.enums.CssClass.COMPILE_CSS:

            command = zz.ide.enums.Command.COMPILE_CSS;

            break;

        case zz.ide.enums.CssClass.COMPILE_MODELS:

            command = zz.ide.enums.Command.COMPILE_MODELS;

            break;

        case zz.ide.enums.CssClass.CALC_DEPS:

            command = zz.ide.enums.Command.CALCDEPS;

            break;

        case zz.ide.enums.CssClass.EXTRACT_MSG:

            command = zz.ide.enums.Command.EXTRACTMSG;

            break;
    }

    return command;
};

/**
 * Get id from command to server
 * @param {string} command
 * @return {string}
 */
zz.ide.services.ConstantsConverter.prototype.getIdFromCommand = function( command ){

    var id;

    switch( command ){

        case zz.ide.enums.Command.COMPILE_APP:

            id = zz.ide.enums.CssClass.COMPILE_APP;
            break;

        case zz.ide.enums.Command.COMPILE_SOY:

            id = zz.ide.enums.CssClass.COMPILE_SOY;

            break;

        case zz.ide.enums.Command.COMPILE_MODELS:

            id = zz.ide.enums.CssClass.COMPILE_MODELS;

            break;

        case zz.ide.enums.Command.COMPILE_CSS:

            id = zz.ide.enums.CssClass.COMPILE_CSS;

            break;

        case zz.ide.enums.Command.CALCDEPS:

            id = zz.ide.enums.CssClass.CALC_DEPS;

            break;

        case zz.ide.enums.Command.EXTRACTMSG:

            id = zz.ide.enums.CssClass.EXTRACT_MSG;

            break;
    }

    return id;
};

/**
 * Get ace mode by file type.
 * @param {string} fileType
 * @return {string}
 */
zz.ide.services.ConstantsConverter.prototype.getAceModeFromFileType = function( fileType ){

    var aceMode;
    switch( fileType ){

        case zz.ide.enums.Const.JS:

            aceMode = zz.ide.enums.Const.ACE_MODE_JS;
            break;

        case zz.ide.enums.Const.YAML:

            aceMode = zz.ide.enums.Const.ACE_MODE_YAML;
            break;

        case zz.ide.enums.Const.SCSS:

            aceMode = zz.ide.enums.Const.ACE_MODE_SCSS;
            break;

        case zz.ide.enums.Const.SOY:

            aceMode = zz.ide.enums.Const.ACE_MODE_SOY;
            break;

        case zz.ide.enums.Const.JSON:

            aceMode = zz.ide.enums.Const.ACE_MODE_JSON;
            break;

        case zz.ide.enums.Const.TPL:

            aceMode = zz.ide.enums.Const.ACE_MODE_TPL;
            break;

        default:

            break;
    }
    return aceMode;
};

/**
 * Get file type from route.
 * @param  {string} route
 * @return {string}
 */
zz.ide.services.ConstantsConverter.prototype.getFileTypeFromRoute = function( route ){

    var fileType;
    switch( route ){

        case zz.ide.enums.Route.MODELS:

            fileType = zz.ide.enums.Const.YAML;
            break;

        case zz.ide.enums.Route.TEMPLATES:

            fileType = zz.ide.enums.Const.SOY;
            break;

        case zz.ide.enums.Route.STYLES:

            fileType = zz.ide.enums.Const.SCSS;
            break;

        case zz.ide.enums.Route.MESSAGES:

            fileType = zz.ide.enums.Const.SOY;
            break;

        case zz.ide.enums.Route.INDEX:

            fileType = zz.ide.enums.Const.TPL;
            break;

        case zz.ide.enums.Route.CONTROLLERS:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.ENUMS:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.ERRORS:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.EVENTS:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.FACTORIES:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.SERVICES:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.VIEWS:

            fileType = zz.ide.enums.Const.JS;
            break;

        case zz.ide.enums.Route.TESTS:

            fileType = zz.ide.enums.Const.JS;
            break;

        default:

            break;
    }
    return fileType;
};



