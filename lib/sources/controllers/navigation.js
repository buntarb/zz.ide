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


goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.FolderTitles' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.views.Navigation' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.models.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
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
zz.environment.services.MVCRegistry.setController( 'navigation', zz.ide.controllers.Navigation );

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
    this.getHandler( ).listenWithScope(

        this.router_,
        zz.environment.enums.EventType.ROUTED,
        this.routeChangedHandler_,
        false,
        this
    );
};

/**
 *  @override
 */
zz.ide.controllers.Navigation.prototype.setupModelInternal = function( ){

    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.MODELS,
        'storage',
        '#4285f4',
        zz.ide.enums.Path.MODELS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.TEMPLATES,
        'web',
        '#ef6c00',
        zz.ide.enums.Path.TEMPLATES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.STYLES,
        'insert_drive_file',
        '#33ac71',
        zz.ide.enums.Path.STYLES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.MESSAGES,
        'language',
        undefined,
        zz.ide.enums.Path.MESSAGES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.RESOURCES,
        'collections',
        undefined,
        zz.ide.enums.Path.RESOURCES,
        zz.ide.enums.Const.FOLDER,
        true
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.CONTROLLERS,
        'folder',
        undefined,
        zz.ide.enums.Path.CONTROLLERS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.ENUMS,
        'folder',
        undefined,
        zz.ide.enums.Path.ENUMS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.ERRORS,
        'folder',
        undefined,
        zz.ide.enums.Path.ERRORS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.EVENTS,
        'folder',
        undefined,
        zz.ide.enums.Path.EVENTS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.FACTORIES,
        'folder',
        undefined,
        zz.ide.enums.Path.FACTORIES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.SERVICES,
        'folder',
        undefined,
        zz.ide.enums.Path.SERVICES,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.VIEWS,
        'folder',
        undefined,
        zz.ide.enums.Path.VIEWS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.TESTS,
        'folder',
        undefined,
        zz.ide.enums.Path.TESTS,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.BASE_JS,
        'description',
        undefined,
        zz.ide.enums.Path.BASE_JS,
        zz.ide.enums.Const.FILE,
        true
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.INDEX,
        'folder',
        undefined,
        zz.ide.enums.Path.INDEX,
        zz.ide.enums.Const.FOLDER
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.PACKAGE_JSON,
        'description',
        undefined,
        zz.ide.enums.Path.PACKAGE_JSON,
        zz.ide.enums.Const.FILE
    ] );
    this.getModel( ).createLast( [

        zz.ide.enums.FolderTitles.CONFIG_YAML,
        'description',
        undefined,
        zz.ide.enums.Path.CONFIG_YAML,
        zz.ide.enums.Const.FILE
    ] );
    this.routeChangedHandler_( );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.Navigation.prototype.actionHandler_ = function( e ){

    var fragment;
    if( goog.array.lastIndexOf( e.model.path, '.' ) > 0  ){

        fragment =
            '/?file=' +
            e.model.path.slice(
                goog.array.lastIndexOf( e.model.path, '/' ) + 1 );

    }else if( e.model.path.slice(
        goog.array.lastIndexOf( e.model.path, '/' ) ) === '/scss' ){

        fragment = '/styles';

    }else if( goog.array.lastIndexOf( e.model.path, '/' ) > 0 ){

        fragment = e.model.path.slice(
            goog.array.lastIndexOf( e.model.path, '/' ) );

    }else if( e.model.path === 'srv'){

        fragment = '/index';
    }
    this.router_.setFragment( fragment );
    e.stopPropagation( );
};

/**
 * Route changed handler.
 * @param {zz.environment.events.Routed=} opt_e
 * @private
 */
zz.ide.controllers.Navigation.prototype.routeChangedHandler_ = function( opt_e ){

    var route;
    if( opt_e ){

        route = opt_e.getCurrFragment( );

    }else{

        route = this.router_.getFragment( );
    }
    this.selectFolder_( route );
};


/**
 * Select folder.
 * @param {string} route
 * @private
 */
zz.ide.controllers.Navigation.prototype.selectFolder_ = function( route ){

    if( goog.dom.pattern.matchStringOrRegex( /\/models/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.MODELS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/templates/, route ) ) {

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.TEMPLATES );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/styles/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.STYLES );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/messages/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.MESSAGES );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/resources/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.RESOURCES );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/controllers/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.CONTROLLERS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/enums/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.ENUMS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/errors/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.ERRORS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/events/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.EVENTS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/factories/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.FACTORIES );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/services/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.SERVICES );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/tests/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.TESTS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/views/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.VIEWS );

    }else if( goog.dom.pattern.matchStringOrRegex( /\/index/, route ) ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.INDEX );

    }else if( route === zz.ide.enums.Route.BASE_JS ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.BASE_JS );

    }else if( route === zz.ide.enums.Route.CONFIG_YAML ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.CONFIG_YAML );

    }else if( route === zz.ide.enums.Route.PACKAGE_JSON ){

        this.markSelectedFolder_( zz.ide.enums.FolderTitles.PACKAGE_JSON );
    }
};

/**
 * Mark selected folder.
 * @param {string} folderTitle
 * @private
 */
zz.ide.controllers.Navigation.prototype.markSelectedFolder_ = function( name ){

    var model = this.getModel( );
    var loop = true;
    if( model.firstDatarow( ) ){

        model.currentDatarow( ).selected = false;
        while( model.nextDatarow( ) ){

            model.currentDatarow( ).selected = false;
        }
    }
    if( model.firstDatarow( ) ){

        while( loop ){

            if( model.currentDatarow( ).name === name ){

                model.currentDatarow( ).selected = true;
                loop = false;

            }else{

                model.nextDatarow( );
            }
        }
    }
};