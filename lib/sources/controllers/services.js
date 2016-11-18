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

goog.provide( 'zz.ide.controllers.Services' );

goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.controllers.enums.EventType' );

goog.require( 'zz.ide.enums.DataAction' );

goog.require( 'zz.ide.views.Services' );

/**
 * Services controller.
 * @param {zz.ide.models.Services} model
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Services = function( model, opt_dom ){

    var view = zz.ide.views.Services.getInstance( );

    goog.base( this, model, view, opt_dom );
};


goog.inherits( zz.ide.controllers.Services, zz.ide.controllers.BaseViewController );


/**
 * @override
 */
zz.ide.controllers.Services.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.Services.prototype.setupModelInternal = function( ){

    this.getModel().createLast( [ 'start server', 'flight_takeoff', 'data-start-server'] );
    this.getModel().createLast( [ 'start ide', 'border_color', 'data-start-ide'] );
    this.getModel().createLast( [ 'start 1', 'cloud', 'data-start-server'] );
    this.getModel().createLast( [ 'start 2', 'desktop_windows', 'data-start-server'] );
    this.getModel().createLast( [ 'start 3', 'person', 'data-start-server'] );

};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Services.prototype.actionHandler_ = function( e ){

    console.log( e );

    this.getLayout( ).closePopup( );
    e.stopPropagation( );
};