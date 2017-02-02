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
goog.require( 'zz.ide.enums.Messages' );

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

    this.handler_ = new goog.events.EventHandler( );
    this.openTimerId_;
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

    if( this.getTooltip( e ) ){

        this.handler_.listen(

            goog.dom.getDomHelper( ).getWindow( ),
            [
                goog.events.EventType.SCROLL,
                goog.events.EventType.TOUCHMOVE
            ],
            this.leaveHandler_,
            false,
            this
        );

        this.handler_.listen(

            goog.dom.getDomHelper( ).getWindow( ),
            goog.events.EventType.MOUSEMOVE,
            this.mousemoveHandler_,
            false,
            this
        );

        var opt_position;

        switch( this.getTooltipPosition( e ) ) {

            case zz.ide.enums.Messages.TOOLTIP_LEFT:

                opt_position = zz.ide.enums.Messages.TOOLTIP_LEFT;

                break;

            case zz.ide.enums.Messages.TOOLTIP_TOP:

                opt_position = zz.ide.enums.Messages.TOOLTIP_TOP;

                break;

            case zz.ide.enums.Messages.TOOLTIP_RIGHT:

                opt_position = zz.ide.enums.Messages.TOOLTIP_RIGHT;

                break;

            default:

                break;
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
 * @param {zz.controllers.events.Leave} e
 * @private
 */
zz.ide.services.TooltipApi.prototype.leaveHandler_ = function( e ){

    var self;
    if( this === zz.ide.services.TooltipApi.getInstance( ) ){

        self = this;

    }else{

        self = zz.ide.services.TooltipApi.getInstance( );
    }
    self.closeTooltip( );
    self.handler_.unlisten(

        goog.dom.getDomHelper( ).getWindow( ),
        [
            goog.events.EventType.SCROLL,
            goog.events.EventType.TOUCHMOVE
        ],
        self.leaveHandler_,
        false
    );

    self.handler_.unlisten(

        goog.dom.getDomHelper( ).getWindow( ),
        goog.events.EventType.MOUSEMOVE,
        self.mousemoveHandler_,
        false
    );
};

/**
 * Mouse move event handler.
 * @param {goog.events.Event} e
 * @private
 */
zz.ide.services.TooltipApi.prototype.mousemoveHandler_ = function( e ){

    var closeTooltip = !!goog.dom.getAncestor( e.target, function( node ){

        var result;
        if( node === goog.dom.getDocument( ) ){

            result = false;
        }else {

            result = node ? node.getAttribute( zz.ide.enums.Const.DATA_TOOLTIP ) : false;
        }
       return result;
    }) || !!e.target.getAttribute( zz.ide.enums.Const.DATA_TOOLTIP );

    if( !closeTooltip ){

        var self = zz.ide.services.TooltipApi.getInstance( );

        self.closeTooltip( );

        self.handler_.unlisten(

            goog.dom.getDomHelper( ).getWindow( ),
            [
                goog.events.EventType.SCROLL,
                goog.events.EventType.TOUCHMOVE
            ],
            self.leaveHandler_,
            false
        );

        self.handler_.unlisten(

            goog.dom.getDomHelper( ).getWindow( ),
            goog.events.EventType.MOUSEMOVE,
            self.mousemoveHandler_,
            false
        );
    }
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

    this.openTooltip_( text, element, opt_position );
};


/**
 *  Open tooltip.
 *  @param {string} text
 *  @param {Element} element
 *  @param {string} opt_position
 *  @private
 */
zz.ide.services.TooltipApi.prototype.openTooltip_ = function( text, element, opt_position ){

    var left, top;
    this.model_.lastDatarow( ).text = text;
    var tooltipElement = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );
    var elementRect = element.getBoundingClientRect( );
    var tooltipWidth = goog.style.getSize( tooltipElement ).width;

    switch( opt_position ){

        case zz.ide.enums.Messages.TOOLTIP_LEFT:

            top = elementRect.top + elementRect.height/2 - 15;
            left = elementRect.left - tooltipWidth - 10;

            break;

        case zz.ide.enums.Messages.TOOLTIP_TOP:

            top = elementRect.top - 40;
            left = elementRect.left + elementRect.width/2 - tooltipWidth/2;

            break;

        case zz.ide.enums.Messages.TOOLTIP_RIGHT:

            top = elementRect.top + elementRect.height/2 - 15;
            left = elementRect.right + 10;

            break;

        default:

            top = elementRect.bottom + 10;
            left = elementRect.left + elementRect.width/2 - tooltipWidth/2;

            break;
    }

    if( elementRect.height !== 0 &&  elementRect.width !== 0 ){

        goog.style.setStyle( tooltipElement, {

            top: top + 'px',
            left: left + 'px'
        } );
        goog.dom.classlist.add(

            tooltipElement,
            zz.ide.enums.CssClass.SHOW
        );
    }
};
/**
 *  Close tooltip window.
 */
zz.ide.services.TooltipApi.prototype.closeTooltip = function( ){

    var tooltipElement = goog.dom.getElement( zz.ide.enums.CssClass.TOOLTIP );

    goog.dom.classlist.remove(

        tooltipElement,
        zz.ide.enums.CssClass.SHOW
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

