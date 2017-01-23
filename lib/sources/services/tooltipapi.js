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
goog.require( 'goog.events.EventHandler' );

goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.Const' );

goog.require( 'zz.controllers.enums.EventType' );
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

    this.layout_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getLayoutController( );

    this.tooltipIsReady_ = true;
    this.handler_ = new goog.events.EventHandler( );
    this.setupListenersInternal( );
};

goog.inherits( zz.ide.services.TooltipApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.TooltipApi );

/**
 *  @override
 */
zz.ide.services.TooltipApi.prototype.setupListenersInternal = function( ){

    this.handler_.listenWithScope(

        this.layout_,
        zz.controllers.enums.EventType.LEAVE,
        this.leaveHandler_,
        true,
        this
    );

    this.handler_.listenWithScope(

        this.layout_,
        zz.controllers.enums.EventType.ENTER,
        this.enterHandler_,
        true,
        this
    );
};

/**
 * Mouse enter event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.services.TooltipApi.prototype.enterHandler_ = function( e ){

    console.log( 'enter', e );

    if( this.getTooltip( e ) ){

        var opt_position;

        if( this.getTooltipPosition( e ) ){

            opt_position = zz.ide.enums.Const.TOOLTIP_LEFT;
        }

       this.openTooltip(

                this.getTooltip( e ),
                e.elements[ 0 ],
                opt_position
            );
    }
};

/**
 * Mouse leave event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.services.TooltipApi.prototype.leaveHandler_ = function( e ){

   //if( this.getTooltip( e ) ){
   //
   //     this.closeTooltip( );
   // }
};



/**
 * Get data from data-tooltip.
 * @param {zz.controllers.events.Enter|zz.controllers.events.Leave} e
 * @return {string}
 */
zz.ide.services.TooltipApi.prototype.getTooltip = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.Const.DATA_TOOLTIP );
};

/**
 * Get position for tooltip.
 * @param {zz.controllers.events.Enter|zz.controllers.events.Leave} e
 * @return {string}
 */
zz.ide.services.TooltipApi.prototype.getTooltipPosition = function( e ){

    return e.elements[ 0 ].getAttribute( zz.ide.enums.Const.DATA_TOOLTIP_POSITION );
};
/**
 *  Open tooltip window.
 *  @param {string} text
 *  @param {Element} element
 *  @param {string} opt_position
 */
zz.ide.services.TooltipApi.prototype.openTooltip = function( text, element, opt_position ){

    if( this.tooltipIsReady_ ){

        this.openTooltip_( text, element, opt_position );

    }else{

        var self = this;
        goog.Timer.callOnce(

            function( ){

                self.openTooltip_( text, element, opt_position );
            }, 50
        );
    }
};


/**
 *  Open tooltip.
 *  @param {string} text
 *  @param {Element} element
 *  @param {string} opt_position
 *  @private
 */
zz.ide.services.TooltipApi.prototype.openTooltip_ = function( text, element, opt_position ){

    var property, value;
    this.model_.lastDatarow( ).text = text;
    var tooltipElement = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );
    goog.dom.removeNode( tooltipElement );
    goog.dom.appendChild( element, tooltipElement );
    var tooltipTextElement = goog.dom.getElementByClass( zz.ide.enums.CssClass.TOOLTIP_TEXT, tooltipElement );

    switch( opt_position ){

        case zz.ide.enums.Const.TOOLTIP_LEFT:

            goog.dom.classlist.add(

                tooltipElement,
                zz.ide.enums.CssClass.TOOLTIP_LEFT
            );

            break;

        default:

            value = -goog.style.getSize( tooltipTextElement ).width/2 + 'px';
            property = 'margin-left';

            break;

    }

    goog.style.setStyle( tooltipTextElement, property, value );
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

            goog.dom.classlist.remove(

                tooltipElement,
                zz.ide.enums.CssClass.TOOLTIP_LEFT
            );
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

