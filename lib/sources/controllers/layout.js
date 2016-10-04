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

goog.require( 'goog.dom' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.models.Ace' );
goog.require( 'zz.ide.models.Navigation' );
goog.require( 'zz.ide.controllers.Ace' );
goog.require( 'zz.ide.controllers.Navigation' );
goog.require( 'zz.ide.controllers.Header' );
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
    this.initializeAce_( this.getModel( ) );
    this.initializeHeader_( this.getModel( ) );
};
/**
 * initialize navigation.
 * @private
 */
zz.ide.controllers.Layout.prototype.initializeNavigation_ = function( model ){

    var navigationModel = model.currentDatarow( ).navigation;

    var navigationController = new zz.ide.controllers.Navigation( navigationModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.navigation,
        navigationController );
};

/**
 * initialize ace editor.
 * @param {zz.ide.models.LayoutDataset} model
 * @private
 */
zz.ide.controllers.Layout.prototype.initializeAce_ = function( model ){

    var aceModel = model.currentDatarow( ).ace;
    aceModel.createLast( [

        "ace/theme/chrome",
        "ace/mode/javascript",
        "/** zz.ide test app  **/"
    ] );
    var aceController = new zz.ide.controllers.Ace( aceModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.ace,
        aceController );

};


/**
 * initialize header.
 * @param {zz.ide.models.LayoutDataset} model
 * @private
 */
zz.ide.controllers.Layout.prototype.initializeHeader_ = function( model ){

    var headerModel = model.currentDatarow( ).header;
    headerModel.createLast( );
    var headerController = new zz.ide.controllers.Header( headerModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.header,
        headerController );

};