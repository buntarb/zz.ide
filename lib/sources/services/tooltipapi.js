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

goog.provide( 'zz.ide.services.TooltipApi' );

goog.require( 'goog.dom' );
goog.require( 'goog.style' );
goog.require( 'goog.dom.classlist' );
goog.require( 'goog.Timer' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.services.BaseService' );
goog.require( 'zz.environment.services.Environment' );

/**
 * Service for client api methods.
 * @constructor
 * @extends {zz.services.BaseService}
 */
zz.ide.services.TooltipApi = function( ){

    goog.base( this, 'zz.ide.services.TooltipApi' );

    this.model_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( )
        .getModel( )
        .lastDatarow( )
        .tooltip;

    this.tooltipIsReady_ = true;
};

goog.inherits( zz.ide.services.TooltipApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.TooltipApi );

/**
 *  Open tooltip window.
 *  @param {string=} opt_id
 *  @param {string} text
 *  @param {Element} element
 *  @param {string} opt_position
 */
zz.ide.services.TooltipApi.prototype.openTooltip = function(

    opt_id,
    text,
    element,
    opt_position){

    //var top;
    //var elementSize = goog.style.getSize( element );
    //var elementPosition = goog.style.getClientPosition( element );
    //
    //while( this.model_.deleteLast( ) ){}
    //
    //if( !opt_position ){
    //
    //    top = elementPosition.y + elementSize.height + 5;
    //    this.model_.createLast( [
    //
    //        opt_id,
    //        text,
    //        top,
    //        0
    //    ] );
    //    var tooltipElement = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );
    //    var tooltipElementWidth = goog.style.getSize( tooltipElement).width;
    //    if( tooltipElementWidth > elementSize.width ){
    //
    //        this.model_.lastDatarow( ).left = elementPosition.x - ( tooltipElementWidth - elementSize.width )/2;
    //
    //    }else{
    //
    //        this.model_.lastDatarow( ).left = elementPosition.x + ( elementSize.width - tooltipElementWidth )/2;
    //    }
    //}

    if( this.tooltipIsReady_ ){

        this.openTooltipInternal( opt_id,

            text,
            element,
            opt_position
        );
    }else{

        var self = this;
        goog.Timer.callOnce(

            function( ){

                self.openTooltipInternal( opt_id,

                    text,
                    element,
                    opt_position
                );
            }, 50
        );
    }
};


/**
 *  Open tooltip internal.
 *  @param {string=} opt_id
 *  @param {string} text
 *  @param {Element} element
 *  @param {string} opt_position
 */
zz.ide.services.TooltipApi.prototype.openTooltipInternal = function(  opt_id,
                                                               text,
                                                               element,
                                                               opt_position
){

    this.model_.lastDatarow( ).text = text;
    var tooltipElement = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );
    goog.dom.removeNode( tooltipElement );
    goog.dom.appendChild( element, tooltipElement );
    var tooltipTextElement = goog.dom.getElementByClass( zz.ide.enums.CssClass.TOOLTIP_TEXT, tooltipElement );
    var marginLeft = -goog.style.getSize( tooltipTextElement ).width/2;
    goog.style.setStyle( tooltipTextElement, 'margin-left', marginLeft + 'px' );
    goog.dom.classlist.add(

        tooltipTextElement,
        zz.ide.enums.CssClass.SHOW
    );
    this.tooltipIsReady_ = false;
};
/**
 *  Close tooltip window.
 */
zz.ide.services.TooltipApi.prototype.closeTooltip = function( ){

    var tooltipElement = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );

    var self = this;
    goog.dom.classlist.remove(

        goog.dom.getElementByClass( zz.ide.enums.CssClass.TOOLTIP_TEXT, tooltipElement ),
        zz.ide.enums.CssClass.SHOW
    );
    goog.Timer.callOnce(

        function( ){

            goog.dom.removeNode( tooltipElement );
            goog.dom.appendChild(

                goog.dom.getElementByClass( zz.ide.enums.CssClass.DATAROW, goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP_WRAPPER ) ),
                tooltipElement
            );
            self.tooltipIsReady_ = true;
        }, 50
    );
};

/**
 *  Get tooltip controller
 *  @return {zz.ide.controllers.Error}
 */
zz.ide.services.TooltipApi.prototype.getTooltipController = function( ){

    return zz.environment.services.MVCRegistry

        .getInstance( )
        .get( this.model_.getUid( ) )
        .controller;
};

/**
 *  Get tooltip model.
 *  @return {zz.models.Dataset}
 */
zz.ide.services.TooltipApi.prototype.getTooltipModel = function( ){

    return this.model_;
};

