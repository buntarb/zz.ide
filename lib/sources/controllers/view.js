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

goog.provide( 'zz.ide.controllers.View' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.ide.views.View' );
goog.require( 'zz.ide.controllers.Ace' );
goog.require( 'zz.ide.controllers.Filelist' );
goog.require( 'zz.ide.controllers.Startpage' );
goog.require( 'zz.models.enums.EventType' );

/**
 * View controller.
 * @param {zz.ide.models.View} model
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.View = function( model, opt_dom ){

    /**
     * View view.
     * @type {zz.ide.views.View}
     */
    var view = zz.ide.views.View.getInstance( );

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.View, zz.controllers.FEBase );

/**
 * override
 */
zz.ide.controllers.View.prototype.enterDocument = function( ){

    goog.base( this, 'enterDocument' );

    //this.initializeAce_( this.getModel( ) );
    this.initializeFilelist_( this.getModel( ) );
    //this.initializeStartpage_( this.getModel( ) );
};

/**
 * initialize ace editor.
 * @param {zz.ide.models.ViewDataset} model
 * @private
 */
zz.ide.controllers.View.prototype.initializeAce_ = function( model ){

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
 * initialize file list.
 * @param {zz.ide.models.ViewDataset} model
 * @private
 */
zz.ide.controllers.View.prototype.initializeFilelist_ = function( model ){

    var filelistModel = model.currentDatarow( ).filelist;
    filelistModel.createLast(  );
    var filelistController = new zz.ide.controllers.Filelist( filelistModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.filelist,
        filelistController );

};


/**
 * initialize startpage.
 * @param {zz.ide.models.ViewDataset} model
 * @private
 */
zz.ide.controllers.View.prototype.initializeStartpage_ = function( model ){

    var startpageModel = model.currentDatarow( ).startpage;
    startpageModel.createLast(  );
    var startpageController = new zz.ide.controllers.Startpage( startpageModel );

    this.addFieldController(

        model.currentDatarow( ),
        model.datafield.startpage,
        startpageController );

};