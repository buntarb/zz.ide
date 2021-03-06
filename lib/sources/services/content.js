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
 * @extends {zz.services.BaseService}
 */
zz.ide.services.Content = function( ){

    goog.base( this, 'zz.ide.services.Content' );
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

            content =

            "goog.provide( 'controllers." + name + "' );\n" +
            "goog.require( 'models." + name + "' );\n" +
            "goog.require( 'views." + name + "' );\n" +
            "goog.require( 'zz.controllers.FEBase' );\n" +
            "goog.require( 'zz.environment.services.MVCRegistry' );\n" +
            "\n" +
            "/**\n" +
             " * Controller.\n" +
             " * @extends {zz.controllers.FEBase}\n" +
             " */\n" +
            "controllers." + name + " = class extends zz.controllers.FEBase{\n\n" +

                "\tconstructor( ){\n" +

                    "\t\tsuper(\n" +
                        "\t\t\tnew models." + name  + "( ),\n" +
                        "\t\t\tviews." + name + ".getInstance( )\n"  +
                    "\t\t)\n" +
            "\t}\n\n" +
                "\t/**\n" +
                 "\t * @override\n" +
                 "\t */\n" +
                "\tsetupListenersInternal( ){ }\n" +
                "\n\t/**\n" +
                 "\t * @override\n" +
                 "\t */\n" +
                "\tsetupModelInternal( ){ }\n" +
                "\n\t/**\n" +
                 "\t * @override\n" +
                 "\t */\n" +
                "\tbootstrap( ){ }\n" +
            "};\n" +
            "zz.environment.services.MVCRegistry\n" +
                "\n\t.setController( 'controllers"+ name + "' , controllers." + name + " );\n";
            break;

        case zz.ide.enums.Route.ENUMS:

            content = "goog.provide( '" + name + "' );\n\n/**\n * Description.\n * @type {string}\n */\n" + name + " = {\n\n    Example: 'example'\n};";
            break;

        case zz.ide.enums.Route.ERRORS:

            
            break;

        case zz.ide.enums.Route.EVENTS:

            content =

                "goog.provide( 'events." + name + "' );\n" +
                "goog.require( 'zz.events.BaseEvent' );\n" +
                "\n" +
                "/**\n" +
                " * Event.\n" +
                " * @extends {zz.events.BaseEvent}\n" +
                " */\n" +
                "events." + name + " = class extends zz.events.BaseEvent{\n\n" +

                "\tconstructor( ){\n" +

                "\t\tsuper( 'events." + name  + "' )\n" +
                "\t}\n\n" +
                "};\n";
            break;

        case zz.ide.enums.Route.FACTORIES:

            content =

                "goog.provide( 'factories." + name + "' );\n" +
                "goog.require( 'zz.factories.BaseFactory' );\n" +
                "\n" +
                "/**\n" +
                " * Factory.\n" +
                " * @extends {zz.services.BaseService}\n" +
                " */\n" +
                "factories." + name + " = class extends zz.factories.BaseFactory{\n\n" +

                "\tconstructor( ){\n" +

                "\t\tsuper( 'factories." + name  + "' )\n" +
                "\t}\n\n" +
                "};\n" +
                "goog.addSingletonGetter( factories." + name  + " );\n";
            break;

        case zz.ide.enums.Route.SERVICES:

            content =

                "goog.provide( 'services." + name + "' );\n" +
                "goog.require( 'zz.services.BaseService' );\n" +
                "\n" +
                "/**\n" +
                " * Service.\n" +
                " * @extends {zz.services.BaseService}\n" +
                " */\n" +
                "services." + name + " = class extends zz.services.BaseService{\n\n" +

                "\tconstructor( ){\n" +

                "\t\tsuper( 'services." + name  + "' )\n" +
                "\t}\n\n" +
                "};\n" +
                "goog.addSingletonGetter( services." + name  + " );\n";
            break;

        case zz.ide.enums.Route.VIEWS:

            content =

                "goog.provide( 'views." + name + "' );\n" +
                "goog.require( 'zz.views.FEBase' );\n" +
                "goog.require( 'templates' );\n" +
                "goog.require( 'zz.environment.services.MVCRegistry' );\n" +
                "\n" +
                "/**\n" +
                " * View.\n" +
                " * @extends {zz.views.FEBase}\n" +
                " */\n" +
                "views." + name + " = class extends zz.views.FEBase{\n\n" +

                "\tconstructor( ){\n" +

                "\t\tsuper( templates." + name  + " )\n" +
                "\t}\n\n" +
                "};\n" +
                "goog.addSingletonGetter( views." + name  + " );\n" +
                "zz.environment.services.MVCRegistry\n" +
                "\n\t.setView( 'views"+ name + "' , views." + name + " );\n";

            break;

        case zz.ide.enums.Route.TESTS:

            content = "goog.provide( '" + name + "' );\ngoog.setTestOnly( '" + name + "' );";
            break;

        default:

            break;
    }
    
    return content;
};







