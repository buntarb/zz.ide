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

goog.provide( 'zz.ide.controllers.Application' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.ide.models.Layout' );
goog.require( 'zz.environment.services.MVCTree' );

/**
 * Application controller.
 * @param {zz.ide.models.Application} model
 * @param {zz.ide.views.Application} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Application = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Application, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'application', zz.ide.controllers.Application );

/**
 * override
 */
zz.ide.controllers.Application.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );
    this.getModel( ).createLast( );
    this.initializeLayout_( this.getModel( ) );
};

/**
 * initialize layout.
 * @param {zz.ide.models.ApplicationDataset} model
 * @private
 */
zz.ide.controllers.Application.prototype.initializeLayout_ = function( model ){

    var layoutModel = model.lastDatarow( ).layout;
    layoutModel.createLast( [undefined, undefined, undefined, 'add', false] );

    var navigationModel = layoutModel.lastDatarow( ).navigation;
    navigationModel.createLast( );

    var headerModel = layoutModel.lastDatarow( ).header;
    headerModel.createLast( ["menu"] );

    var viewModel = layoutModel.lastDatarow( ).view;
    viewModel.createLast( );

    var filelistModel = viewModel.lastDatarow( ).filelist;
    filelistModel.createLast(  );

    var blankfolderModel = viewModel.lastDatarow( ).filelist;
    blankfolderModel.createLast(  );

    var aceModel = viewModel.lastDatarow( ).ace;
    aceModel.createLast( [

        "ace/theme/chrome",
        "ace/mode/javascript",
        "/** zz.ide test app  **/"
    ] );
};

