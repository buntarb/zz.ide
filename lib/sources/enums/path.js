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

goog.provide( 'zz.ide.enums.Path' );

/**
 * Restore path.
 * @type {string}
 */
zz.ide.enums.Path = {

    MODELS: 'lib/models',
    TEMPLATES: 'lib/templates',
    STYLES: 'lib/stylesheets/scss',
    MESSAGES: 'lib/messages',
    RESOURCES: 'lib/resources',
    CONTROLLERS: 'lib/sources/controllers',
    ENUMS: 'lib/sources/enums',
    ERRORS: 'lib/sources/errors',
    EVENTS: 'lib/sources/events',
    FACTORIES: 'lib/sources/factories',
    SERVICES: 'lib/sources/services',
    TESTS: 'lib/sources/tests',
    VIEWS: 'lib/sources/views',
    INDEX: 'srv',
    BASE_JS: 'lib/sources/base.js',
    PACKAGE_JSON: 'package.json',
    CONFIG_YAML: 'config.yaml'
};