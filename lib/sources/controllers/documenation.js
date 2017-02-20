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

goog.provide( 'zz.ide.controllers.Documentation' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );
goog.require( 'goog.array' );
goog.require( 'goog.Timer' );

goog.require( 'zz.models.enums.EventType' );

goog.require( 'zz.environment.enums.EventType' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.controllers.BaseViewController' );

/**
 * Documentation controller.
 * @param {zz.ide.models.Documentation} model
 * @param {zz.ide.views.Documentation} view
 * @param opt_dom
 * @constructor
 * @extends {zz.ide.controllers.BaseViewController}
 */
zz.ide.controllers.Documentation = function( model, view, opt_dom ){

    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Documentation, zz.ide.controllers.BaseViewController );

/**
 *  @override
 */
zz.ide.controllers.Documentation.prototype.setupListenersInternal = function( ){

};

/**
 *  @override
 */
zz.ide.controllers.Documentation.prototype.bootstrap = function( ){

    var parent = this.getParent( );

    parent.getView( ).setSize( parent.getModel( ).lastDatarow( ).width, parent.getModel( ).lastDatarow( ).height );
    parent.getView( ).setPosition( parent.getModel( ).lastDatarow( ).top, parent.getModel( ).lastDatarow( ).left );

    goog.Timer.callOnce( function( ){

        if( this.layout_.getSearchController( ).getClassMethodSearch( ) ){

            this.goToMethodDocumentation( this.layout_.getSearchController( ).getClassMethodSearch( ) );

            this.layout_.getSearchController( ).setClassMethodSearch( '' );
        }
    }, zz.ide.enums.Const.ANIMATION_OPEN_MODAL_DELAY + 10, this );
};
/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Documentation.prototype.actionHandler_ = function( e ){


};

/**
 * Go to class method or property in documentation.
 * @param {string} name
 * @method
 */
zz.ide.controllers.Documentation.prototype.goToMethodDocumentation = function( name ){

    var documentationBodyElement = goog.dom.getElementByClass(

        zz.ide.enums.CssClass.MODAL_BODY
    );

    var methodElements = goog.dom.getElementsByClass( zz.ide.enums.CssClass.DOCUMENTATION_CHILD );

    var loop = true;
    var methodIsFind;

    if( this.getModel( ).lastDatarow( ).method.firstDatarow( ) ){

        while( loop ){

            if( this.getModel( ).lastDatarow( ).method.currentDatarow( ).name === name ){

                this.getModel( ).lastDatarow( ).method.currentDatarow( ).open = true;
                loop = false;
                methodIsFind = true;
            }else{

                if( !this.getModel( ).lastDatarow( ).method.nextDatarow( ) ){

                    loop = false;
                }
            }
        }
        loop = true;
    }
    if( this.getModel( ).lastDatarow( ).property.firstDatarow( ) && !methodIsFind ){

        while( loop ){

            if( this.getModel( ).lastDatarow( ).property.currentDatarow( ).name === name ){

                this.getModel( ).lastDatarow( ).property.currentDatarow( ).open = true;
                loop = false;
            }else{

                if( !this.getModel( ).lastDatarow( ).property.nextDatarow( ) ){

                    loop = false;
                }
            }
        }
    }

    goog.array.forEach( methodElements, function( element ){

        if( element.getAttribute( zz.ide.enums.Const.DATA_NAME ) === name ){


            documentationBodyElement.scrollTop = goog.style.getRelativePosition(

                element, documentationBodyElement
            ).y;
        }
    }, this );
};

