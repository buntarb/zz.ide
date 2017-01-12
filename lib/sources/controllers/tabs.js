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


goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.FolderTitles' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.services.HashViewApi' );

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

    this.router_ = zz.environment.services.Environment.getInstance( )

        .getRootController( )
        .getRouter( );

    this.layout_ = zz.environment.services.Environment.getInstance( )

        .getRootController( )
        .getLayoutController( );


    this.hashViewApi_ = zz.ide.services.HashViewApi.getInstance( );
        
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
zz.ide.controllers.Tabs.prototype.setupModelInternal = function( ){

    var hashView = this.layout_.getHashView( );
    var model = this.getModel( );
    var hashTabs = [];
    var hashViewFile = this.hashViewApi_.getHashFileView( );
    hashViewFile = hashViewFile.reverse( );

    if( hashViewFile.length > 3 ){

        hashTabs = goog.array.splice( hashViewFile, 0, 3 );
    }else{

        hashTabs = hashViewFile;
    }

    goog.array.forEach( hashTabs, function( item ){

        var name = item.route.slice(

                0,
                goog.array.lastIndexOf(

                    item.route,
                    '?'

                )
            )

            + item.route.slice(

                goog.array.lastIndexOf(

                    item.route,
                    '='

                ) + 1 );
        var icon = zz.ide.services.ConstantsConverter.getInstance( ).getIconFromRoute( item.route );
        var cssClass = zz.ide.services.ConstantsConverter.getInstance( ).getClassFromRoute( item.route );
        model.createLast( [ name, item.route, icon, cssClass ] );
    } );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Tabs.prototype.actionHandler_ = function( e ){

    this.router_.setFragment( e.model.route );
    e.stopPropagation( );
};
