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

goog.provide( 'zz.ide.enums.CssClass' );

/**
 * Default CSS class to be applied to the root element of view.
 * @type {string}
 */
zz.ide.enums.CssClass = {

    MODAL_BODY: goog.getCssName( 'modal--body' ),
    MODAL: goog.getCssName( 'modal' ),
    MODAL_ADD_FILE: goog.getCssName( 'modal_add-file' ),
    MODAL_RENAME_FILE: goog.getCssName( 'modal_rename-file' ),
    MODAL_DELETE_FILE: goog.getCssName( 'modal_delete-file' ),
    MODAL_DOC: goog.getCssName( 'modal_doc' ),
    MODAL_ERROR: goog.getCssName( 'modal_error' ),
    POPUP: goog.getCssName( 'popup' ),
    TOOLTIP: goog.getCssName( 'tooltip' ),
    TOOLTIP_WRAPPER: goog.getCssName( 'tooltip-wrapper' ),
    LAYOUT_SEARCH_WRAPPER: goog.getCssName( 'layout--search-wrapper' ),
    TOOLTIP_TEXT: goog.getCssName( 'tooltip--text' ),
    TOOLTIP_LEFT: goog.getCssName( 'tooltip_left' ),
    TOOLTIP_RIGHT: goog.getCssName( 'tooltip_right' ),
    TOOLTIP_TOP: goog.getCssName( 'tooltip_top' ),
    HEADER: goog.getCssName( 'header' ),
    BLUE: goog.getCssName( 'blue' ),
    ORANGE: goog.getCssName( 'orange' ),
    GREEN: goog.getCssName( 'green' ),
    POPUP_IS_OPEN: goog.getCssName( 'popup-is-open' ),
    ACE_EDITOR: goog.getCssName( 'ace-editor' ),
    START_SERVER: goog.getCssName( 'start-server' ),
    RUN_DEV: goog.getCssName( 'run-dev' ),
    RUN_DBG: goog.getCssName( 'run-dbg' ),
    RUN_APP: goog.getCssName( 'run-app' ),
    RUN_UT: goog.getCssName( 'run-ut' ),
    ICON_MODELS: goog.getCssName( 'models' ),
    ICON_TEMPLATES: goog.getCssName( 'templates' ),
    ICON_STYLES: goog.getCssName( 'styles' ),
    OPEN: goog.getCssName( 'open' ),
    COMPILE_SERVICES: goog.getCssName( 'compile-services' ),
    SERVER_SERVICES: goog.getCssName( 'server-services' ),
    COMPILE_APP: goog.getCssName( 'compile-app' ),
    COMPILE_MODELS: goog.getCssName( 'compile-models' ),
    COMPILE_SOY: goog.getCssName( 'compile-soy' ),
    COMPILE_CSS: goog.getCssName( 'compile-css' ),
    CALC_DEPS: goog.getCssName( 'calc-deps' ),
    EXTRACT_MSG: goog.getCssName( 'extract-msg' ),
    COMPILING: goog.getCssName( 'compiling' ),
    HOVER: goog.getCssName( 'hover' ),
    BLUR: goog.getCssName( 'blur' ),
    ACE_HISTORY: goog.getCssName( 'ace-header--history' ),
    SHOW: goog.getCssName( 'show' ),
    DATAROW: goog.getCssName( 'datarow'),
    VIEW_WRAPPER: goog.getCssName( 'view-wrapper' ),
    FIXED: goog.getCssName( 'fixed' ),
    SEARCH_INPUT: goog.getCssName( 'search--input' ),
    SEARCH_BTN: goog.getCssName( 'layout--search-btn' ),
    DOCUMENTATION_CHILD: goog.getCssName( 'documentation-child' )

};