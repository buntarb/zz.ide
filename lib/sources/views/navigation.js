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

goog.provide( 'zz.ide.views.Navigation' );

goog.require( 'goog.dom' );

goog.require( 'zz.environment.services.RAM' );
goog.require( 'zz.views.FEBase' );
goog.require( 'zz.ide.templates' );
goog.require( 'zz.ide.enums.CssClass' );
/**
 * Widget controller.
 * @constructor
 */
zz.ide.views.Navigation = function( ){

    goog.base( this, zz.ide.templates.navigationDataset, zz.ide.templates.navigationDatarow );
};
goog.inherits( zz.ide.views.Navigation, zz.views.FEBase );
goog.addSingletonGetter( zz.ide.views.Navigation );



/**
 * Datarow updated event handler.
 * @private
 */
zz.ide.views.Navigation.prototype.datarowUpdatedHandler = function( e ){

    if( e.message.datafield === e.message.dataset.datafield.isFolderOpen ){

        var element = zz.environment.services.RAM.getInstance( ).get(

                e.message.dataset.getUid( ) + ":" +
                e.message.datarow.getUid( ) + ":" +
                e.message.datafield).view;

        if( e.message.new_value ){

            goog.dom.classlist.add( element, zz.ide.enums.CssClass.FOLDER_OPEN );

        }else{

            goog.dom.classlist.remove( element, zz.ide.enums.CssClass.FOLDER_OPEN );
        }

    }
    e.stopPropagation( );
};