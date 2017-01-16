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

goog.provide( 'zz.ide.events.RemoveTab' );
goog.require( 'zz.events.BaseEvent' );
goog.require( 'zz.ide.enums.EventType' );

/**
 * Tabs controller remove tab event class.
 * @param {Object} node
 * @extends {zz.events.BaseEvent}
 * @constructor
 */
zz.ide.events.RemoveTab = function( node ){

	goog.base( this, zz.ide.enums.EventType.REMOVE_TAB);

	/**
	 * Controller, related with current event.
	 * @type {zz.ide.controllers.Tabs}
	 */
	this.controller = node.controller;

	/**
	 * Datarow, related with current event.
	 * @type {zz.models.Datarow}
	 */
	this.model = node.model;

	/**
	 * Elements, related with current event.
	 * @type {Array<Element>}
	 */
	this.elements = node.elements;
};
goog.inherits( zz.ide.events.RemoveTab, zz.events.BaseEvent );