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

goog.provide( 'zz.ide.controllers.Tree' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Tree' );
goog.require( 'zz.ide.models.Tree' );

/**
 * Tree controller.
 * @param {zz.ide.models.Tree} model
 * @param opt_dom
 * @constructor
 */
zz.ide.controllers.Tree = function( model, opt_dom ){

    /**
     * Tree view.
     * @type {zz.ide.views.Tree}
     */
    var view = zz.ide.views.Tree.getInstance( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Tree, zz.controllers.FEBase );
