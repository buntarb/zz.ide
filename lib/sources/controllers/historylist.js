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

goog.provide( 'zz.ide.controllers.HistoryList' );

goog.require( 'goog.object' );
goog.require( 'goog.dom.pattern' );

goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.ide.controllers.BaseViewController' );
goog.require( 'zz.ide.views.PopupSearchlist' );

/**
 * File list controller.
 * @param {zz.ide.models.PopupSearchlist} model
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.HistoryList = function( model, opt_dom ){

    var view = zz.ide.views.PopupSearchlist.getInstance( );
    goog.base( this, model, view, opt_dom );
};
goog.inherits(
    
    zz.ide.controllers.HistoryList,
    zz.ide.controllers.BaseViewController );


/**
 * @override
 */
zz.ide.controllers.HistoryList.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.HistoryList.prototype.setupModelInternal = function( ){

    var hashView = this.layout_.getHashView( );
    var model = this.getModel( );

    goog.object.forEach( hashView, function( value, key ){

        if( goog.dom.pattern.matchStringOrRegex( /file=/g, key ) ){

            var name = key.slice(

                    0,
                    goog.array.lastIndexOf(

                        key,
                        '?'

                    )
                )

            + key.slice(

                goog.array.lastIndexOf(

                    key,
                    '='

                ) + 1 );
            var icon = zz.ide.services.ConstantsConverter.getInstance( ).getIconFromRoute( key );
            var cssClass = zz.ide.services.ConstantsConverter.getInstance( ).getClassFromRoute( key );
            model.createLast( [ name, key, icon, cssClass ] );
        }
    } );
};

/**
 *  @override
 */
zz.ide.controllers.HistoryList.prototype.bootstrap = function( ){

    var parent = this.getParent( );
    parent.getView( ).setSize(

        parent.getModel( ).lastDatarow( ).width,
        parent.getModel( ).lastDatarow( ).height );

    parent.getView( ).setPosition(
        
        parent.getModel( ).lastDatarow( ).top,
        parent.getModel( ).lastDatarow( ).left );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.HistoryList.prototype.actionHandler_ = function( e ){

    if( this.getView( ).isActionOpenItem( e ) ){

        this.getLayout( ).closePopup( );
        this.router_.setFragment( e.model.route );
        e.stopPropagation( );

    }else if( this.getView( ).isActionRemoveItem( e ) ){

        var model = this.getModel( );
        var data = model.firstDatarow( );
        if( data ){

            do{

                if( data.getUid( ) === e.model.getUid( ) ){

                    model.deleteCurrent( );
                    this.getLayout( ).removeFromHashView( data.route );
                }
            }while( data = model.nextDatarow( ) );
        }
        e.stopPropagation( );
    }
};