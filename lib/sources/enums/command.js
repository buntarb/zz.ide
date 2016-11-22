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

goog.provide( 'zz.ide.enums.Command' );

/**
 * Restore commands.
 * @type {string}
 */
zz.ide.enums.Command = {

    GET_CHILDREN: 'zz.ide.1',
    OPEN_FILE: 'zz.ide.2',
    SAVE_FILE: 'zz.ide.3',
    REMOVE_FILE: 'zz.ide.4',
    COPY_FILE: 'zz.ide.5',
    RENAME_FILE: 'zz.ide.6',
    COMPILE_APP: 'zz.ide.7',
    COMPILE_JS: 'zz.ide.8',
    COMPILE_SOY: 'zz.ide.9',
    COMPILE_SCSS: 'zz.ide.10',
    COMPILE_GSS: 'zz.ide.11',
    COMPILE_CSS: 'zz.ide.12',
    COMPILE_DOC: 'zz.ide.13',
    COMPILE_MODELS: 'zz.ide.14',
    COMPILE_SVC: 'zz.ide.15',
    CALCDEPS: 'zz.ide.16',
    EXTRACTMSG: 'zz.ide.17',
    START_SERVER: 'zz.ide.18',
    UPDATE: 'zz.ide.19',
    PUBLISH: 'zz.ide.20',
    IDK_HELP: 'zz.ide.21',
    CREATE_FILE: 'zz.ide.22',
    TERN_REQUEST: 'zz.ide.23'
};