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

goog.provide( 'zz.ide.views.AceServices' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.templates.services' );
goog.require( 'zz.ide.views.Services' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Ace services view.
 * @param {function} opt_model
 * @param {function} opt_dataset
 * @constructor
 * @extends {zz.ide.views.Services}
 */
zz.ide.views.AceServices = function( opt_model, opt_dataset ){

    goog.base( this, opt_model || zz.ide.templates.services.ace, opt_dataset || zz.ide.templates.services.aceDataset );
};
goog.inherits( zz.ide.views.AceServices, zz.ide.views.Services );
zz.environment.services.MVCRegistry.setView( 'ace-services', zz.ide.views.AceServices );
goog.addSingletonGetter( zz.ide.views.AceServices );
