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

goog.provide( 'zz.ide.controllers.Blankfolder' );

goog.require( 'goog.dom' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Blankfolder' );
goog.require( 'zz.ide.models.Blankfolder' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );

/**
 * Blankfolder controller.
 * @param {zz.ide.models.Blankfolder} model
 * @param {zz.ide.views.Blankfolder} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Blankfolder = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Blankfolder, zz.controllers.FEBase );
zz.environment.services.MVCRegistry.setController( 'blankfolder', zz.ide.controllers.Blankfolder );

/**
 *  @override
 */
zz.ide.controllers.Blankfolder.prototype.setupListenersInternal = function( ){};

/**
 *  @override
 */
zz.ide.controllers.Blankfolder.prototype.setupModelInternal = function( ){

    //this.getModel( ).createLast( );
};