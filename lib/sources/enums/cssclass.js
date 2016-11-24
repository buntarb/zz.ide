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

    MODAL: goog.getCssName( 'modal' ),
    POPUP: goog.getCssName( 'popup' ),
    HEADER: goog.getCssName( 'header' ),
    BLUE: goog.getCssName( 'blue' ),
    ORANGE: goog.getCssName( 'orange' ),
    GREEN: goog.getCssName( 'green' ),
    POPUP_IS_OPEN: goog.getCssName( 'popup-is-open' ),
    ACE: goog.getCssName( 'ace' )
};