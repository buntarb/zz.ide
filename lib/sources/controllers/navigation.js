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

goog.provide( 'zz.ide.controllers.Navigation' );

goog.require( 'goog.dom' );
goog.require( 'goog.array' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Navigation' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.environment.services.Environment' );


/**
 * Navigation controller.
 * @param {zz.ide.models.Navigation} model
 * @param {zz.ide.views.Navigation} view
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.Navigation = function( model, view, opt_dom ){

    this.router_ = zz.environment.services.Environment.getInstance( )

        .getRootController( )
        .getRouter( );
    goog.base( this, model, view, opt_dom );
};

goog.inherits( zz.ide.controllers.Navigation, zz.controllers.FEBase );
zz.environment.services.MVCTree.registry.setController( 'navigation', zz.ide.controllers.Navigation );

/**
 *  @override
 */
zz.ide.controllers.Navigation.prototype.setupListenersInternal = function( ){

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
zz.ide.controllers.Navigation.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( [

        'Models',
        'storage',
        '#4285f4',
        zz.ide.enums.Path.MODELS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Templates',
        'web',
        '#ef6c00',
        zz.ide.enums.Path.TEMPLATES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Styles',
        'insert_drive_file',
        '#33ac71',
        zz.ide.enums.Path.STYLES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Messages',
        'language',
        undefined,
        zz.ide.enums.Path.MESSAGES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Resources',
        'collections',
        undefined,
        zz.ide.enums.Path.RESOURCES,
        zz.ide.enums.Const.FOLDER,
        true
    ] );
    this.getModel( ).createLast( [

        'Controllers',
        'folder',
        undefined,
        zz.ide.enums.Path.CONTROLLERS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Enums',
        'folder',
        undefined,
        zz.ide.enums.Path.ENUMS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Errors',
        'folder',
        undefined,
        zz.ide.enums.Path.ERRORS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Events',
        'folder',
        undefined,
        zz.ide.enums.Path.EVENTS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Factories',
        'folder',
        undefined,
        zz.ide.enums.Path.FACTORIES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Services',
        'folder',
        undefined,
        zz.ide.enums.Path.SERVICES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Views',
        'folder',
        undefined,
        zz.ide.enums.Path.VIEWS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Tests',
        'folder',
        undefined,
        zz.ide.enums.Path.TESTS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Base.js',
        'description',
        undefined,
        zz.ide.enums.Path.BASE_JS,
        zz.ide.enums.Const.FILE,
        true
    ] );
    this.getModel( ).createLast( [

        'Index',
        'folder',
        undefined,
        zz.ide.enums.Path.INDEX,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        'Package.json',
        'description',
        undefined,
        zz.ide.enums.Path.PACKAGE_JSON,
        zz.ide.enums.Const.FILE
    ] );
    this.getModel( ).createLast( [

        'Config.yaml',
        'description',
        undefined,
        zz.ide.enums.Path.CONFIG_YAML,
        zz.ide.enums.Const.FILE
    ] );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Navigation.prototype.actionHandler_ = function( e ){

    var fragment;
    if( goog.array.lastIndexOf( e.model.path, '.' ) > 0  ){

        fragment = '/?file=' + e.model.path.slice( goog.array.lastIndexOf( e.model.path, '/' ) + 1 );

    }else if( e.model.path.slice( goog.array.lastIndexOf( e.model.path, '/' ) ) === '/scss' ){

        fragment = '/styles';

    }else if( goog.array.lastIndexOf( e.model.path, '/' ) > 0 ){

        fragment = e.model.path.slice( goog.array.lastIndexOf( e.model.path, '/' ) );

    }else if( e.model.path === 'srv'){

        fragment = '/index';
    }
    this.router_.setFragment( fragment );


    e.stopPropagation( );
};