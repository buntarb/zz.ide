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

goog.provide( 'zz.ide.controllers.Layout' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.controllers.Navigation' );
goog.require( 'zz.ide.controllers.Header' );
goog.require( 'zz.ide.controllers.View' );
goog.require( 'zz.models.enums.EventType' );

/**
 * Layout controller.
 * @param {zz.ide.models.Layout} model
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Layout = function( model, opt_dom ){

    /**
     * Layout view.
     * @type {zz.ide.views.Layout}
     */
    var view = zz.ide.views.Layout.getInstance( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Layout, zz.controllers.FEBase );

/**
 * override
 */
zz.ide.controllers.Layout.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );

    this.initializeNavigation_( this.getModel( ) );
    this.initializeHeader_( this.getModel( ) );
    this.initializeView_( this.getModel( ) );
};
/**
 * initialize navigation.
 * @private
 */
zz.ide.controllers.Layout.prototype.initializeNavigation_ = function( model ){

    var navigationModel = model.currentDatarow( ).navigation;
    navigationModel.createLast( );
    var navigationController = new zz.ide.controllers.Navigation( navigationModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.navigation,
        navigationController );
};

/**
 * initialize header.
 * @param {zz.ide.models.LayoutDataset} model
 * @private
 */
zz.ide.controllers.Layout.prototype.initializeHeader_ = function( model ){

    var headerModel = model.currentDatarow( ).header;
    headerModel.createLast( ["menu"] );
    var headerController = new zz.ide.controllers.Header( headerModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.header,
        headerController );

};

/**
 * initialize view.
 * @param {zz.ide.models.ViewDataset} model
 * @private
 */
zz.ide.controllers.Layout.prototype.initializeView_ = function( model ){

    var viewModel = model.currentDatarow( ).view;
    viewModel.createLast( );
    var viewController = new zz.ide.controllers.View( viewModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.view,
        viewController );
};