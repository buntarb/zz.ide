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

goog.provide( 'zz.ide.views.Services' );

goog.require( 'goog.dom' );

goog.require( 'zz.ide.templates.services' );
goog.require( 'zz.ui.views.List' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Services view.
 * @param {function} opt_model
 * @param {function} opt_dataset
 * @param {function} opt_datarow
 * @constructor
 * @extends {zz.ui.views.List}
 */


zz.ide.views.Services = class extends zz.ui.views.List {

    constructor(opt_model, opt_dataset, opt_datarow) {

        super(

            opt_model ||
                zz.ide.templates.services.default,
            opt_dataset ||
                zz.ide.templates.services.dataset,
            opt_datarow ||
            zz.ide.templates.services.datarow
        )
    }
};
zz.environment.services.MVCRegistry.setView( 'services', zz.ide.views.Services );
goog.addSingletonGetter( zz.ide.views.Services );