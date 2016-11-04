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

goog.provide( 'zz.ide.services.Content' );

goog.require( 'zz.services.BaseService' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.Content = function( ){

    goog.base( this );
};

goog.inherits( zz.ide.services.Content, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.Content );


/**
 * Get content for new file.
 * @param {string} name
 * @param {string} type
 * @return {string}
 */
zz.ide.services.Content.prototype.get = function( name, type ){

    var content = "";
    
    switch( type ){

        case zz.ide.enums.Route.MODELS:

            content = "NAMESPACE: '" + name + "'       \n\nFIELDS:\n\n  example:\n\n    index: 0\n    type: zz.models.enums.FieldType.STRING\n    required: false\n\n  example1:\n\n    index: 1\n    type: zz.models.enums.FieldType.NUMBER\n    required: false\n\n  example2:\n\n    index: 2\n    type: zz.models.enums.FieldType.BOOLEAN\n    required: false\n";
            break;

        case zz.ide.enums.Route.TEMPLATES:

            content = "{namespace " + name + "}\n\n/**\n * @param key\n * @param value\n */\n{template .example}\n    <div\n        data-model=\"{$key.data}\"\n        data-action>\n        {$value.data}\n    </div>\n{/template}";
            break;

        case zz.ide.enums.Route.STYLES:

            content = "// Module styles.";
            break;

        case zz.ide.enums.Route.MESSAGES:


            break;

        case zz.ide.enums.Route.INDEX:

            
            break;

        case zz.ide.enums.Route.CONTROLLERS:

            content = "goog.provide( '" + name + "' );\n\ngoog.require( 'zz.app.controllers.FEBaseApplication' );\ngoog.require( '" + name + "' );\n\n/**\n * Application controller.\n * @param {zz.ide.models.Application} model\n * @param {" + name + "} view\n * @param opt_dom\n * @constructor\n * @extends {zz.app.controllers.FEBaseApplication}\n */\n" + name + " = function( model, view, opt_dom ){\n\n    goog.base( this, model, view, opt_dom );\n};\n\ngoog.inherits( " + name + ", zz.app.controllers.FEBaseApplication );\n\n/**\n *  @override\n */\n" + name + ".prototype.setupListenersInternal = function( ){ };\n\n/**\n *  @override\n */\n" + name + ".prototype.setupModelInternal = function( ){ };";

            break;

        case zz.ide.enums.Route.ENUMS:

            content = "goog.provide( '" + name + "' );\n\n/**\n * Description.\n * @type {string}\n */\n" + name + " = {\n\n    Example: 'example'\n};";
            break;

        case zz.ide.enums.Route.ERRORS:

            
            break;

        case zz.ide.enums.Route.EVENTS:

            content = "goog.provide( '" + name + "' );\ngoog.require( 'goog.events.Event' );\ngoog.require( 'zz.events.BaseEvent' );\n\n/**\n * Description.\n * @param {Object} node\n * @extends {zz.events.BaseEvent}\n * @constructor\n */\n" + name + " = function( node ){\n\n\tgoog.base( this, 'enter event name here' );\n};\ngoog.inherits( " + name + ", zz.events.BaseEvent );";
            break;

        case zz.ide.enums.Route.FACTORIES:

            
            break;

        case zz.ide.enums.Route.SERVICES:

            content = "goog.provide( '" + name + "' );\n\ngoog.require( 'zz.services.BaseService' );\n\n/**\n * Description\n * @constructor\n */\n" + name + " = function( ){\n\n    goog.base( this );\n};\n\ngoog.inherits( " + name + ", zz.services.BaseService );\ngoog.addSingletonGetter( " + name + " );\n\n\n/**\n * Description.\n * @param {string} name\n * @param {string} type\n */\n" + name + ".prototype.exampleMethod = function( name, type ){};";
            break;

        case zz.ide.enums.Route.VIEWS:

            content = "goog.provide( '" + name + "' );\n\ngoog.require( 'goog.dom' );\n\ngoog.require( 'zz.views.FEBase' );\ngoog.require( 'enter template name here' );\ngoog.require( 'zz.environment.services.MVCTree' );\n\n/**\n * Description.\n * @constructor\n */\n" + name + " = function( ){\n\n    goog.base( this, enter template name here );\n};\ngoog.inherits( " + name + ", zz.views.FEBase );\ngoog.addSingletonGetter( " + name + " );\nzz.environment.services.MVCTree.registry.setView( 'enter name for registration in MVCTree', " + name + " );";
            break;

        case zz.ide.enums.Route.TESTS:

            content = "goog.provide( '" + name + "' );\ngoog.setTestOnly( '" + name + "' );";
            break;

        default:

            break;
    }
    
    return content;
};







