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

goog.provide( 'zz.ide.controllers.Tabs' );

goog.require( 'goog.dom' );
goog.require( 'goog.array' );

goog.require( 'zz.ide.enums.Route' );

goog.require( 'zz.ide.events.OpenTab' );
goog.require( 'zz.ide.events.RemoveTab' );

goog.require( 'zz.ide.views.Tabs' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );


/**
 * Navigation controller.
 * @param {zz.ide.models.Navigation} model
 * @param {zz.ide.views.Tabs} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Tabs = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};
goog.inherits( zz.ide.controllers.Tabs, zz.controllers.FEBase );
zz.environment.services.MVCRegistry.setController( 'tabs', zz.ide.controllers.Tabs );

/**
 *  @override
 */
zz.ide.controllers.Tabs.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );
};

/**
 *  @override
 */
zz.ide.controllers.Tabs.prototype.setupModelInternal = function( ){};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Tabs.prototype.actionHandler_ = function( e ){

    var node = {

        controller: e.controller,
        model: e.model,
        elements: e.elements
    };
    if( this.getView( ).isActionOpenItem( e ) ){

        this.dispatchEvent( new zz.ide.events.OpenTab( node ) );

    }else if( this.getView( ).isActionRemoveItem( e ) ){

        this.dispatchEvent( new zz.ide.events.RemoveTab( node ) );
    }
    e.stopPropagation( );
};