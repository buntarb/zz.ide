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

goog.provide( 'zz.ide.services.ClientApi' );

goog.require( 'goog.Promise' );
goog.require( 'goog.net.XhrIo' );

goog.require( 'zz.services.BaseService' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.net.WebSocketClient' );

/**
 * Service for client api methods.
 * @constructor
 */
zz.ide.services.ClientApi = function( ){

    goog.base( this );

    this.wsc_ = zz.environment.services.Environment.getInstance( ).getRootController( ).getWSClient( );

    //this.eventHandler_ = new goog.events.EventHandler( );
};

goog.inherits( zz.ide.services.ClientApi, zz.services.BaseService );
goog.addSingletonGetter( zz.ide.services.ClientApi );


/**
 * Get data from server.
 * @param {zz.ide.models.NavigationDatarow} datarow
 */
zz.ide.services.ClientApi.prototype.getFiles = function( path, type ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        path
    ] );

    if( type === zz.ide.enums.Const.FOLDER ){

        this.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );

    }else{

        this.wsc_.sendCommandMessage( zz.ide.enums.Command.OPEN_FILE, model );
    }
};

/**
 * Save file to server.
 * @param {string} name
 * @param {string} path
 * @param {string} content
 */
zz.ide.services.ClientApi.prototype.saveFile = function( name, path, content ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        path,
        undefined,
        content,
        zz.ide.enums.Const.FILE
    ] );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.SAVE_FILE, model );
};


/**
 * Delete file from server.
 * @param {string} path
 */
zz.ide.services.ClientApi.prototype.deleteFile = function( path ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        path
    ] );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.REMOVE_FILE, model );
};

/**
 * Add file to server.
 * @param {string} name
 * @param {string} path
 * @param {string=} opt_content
 * @param {number=} opt_type
 */
zz.ide.services.ClientApi.prototype.createFile = function( name, path, opt_content, opt_type ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        path + '/' + name,
        undefined,
        opt_content,
        opt_type ||zz.ide.enums.Const.FILE
    ] );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.CREATE_FILE, model );
};

/**
 * Rename file.
 * @param {string} path
 * @param {string} path2
 */
zz.ide.services.ClientApi.prototype.renameFile = function( path, path2 ){

    var model = new zz.ide.models.FilesTree();

    model.createLast( [

        path,
        path2
    ] );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.RENAME_FILE, model );
};

/**
 * Compile application.
 */
zz.ide.services.ClientApi.prototype.compileApp = function( ){

    var model = new zz.ide.models.FilesTree();
    model.createLast( );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.COMPILE_APP, model );
};

/**
 * Calculate dependencies.
 */
zz.ide.services.ClientApi.prototype.calculateDeps = function( ){

    var model = new zz.ide.models.FilesTree();
    model.createLast( );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.CALCDEPS, model );
};

/**
 * Compile templates
 */
zz.ide.services.ClientApi.prototype.compileSoy = function( ){

    var model = new zz.ide.models.FilesTree();
    model.createLast( );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.COMPILE_SOY, model );
};

/**
 * Compile styles.
 */
zz.ide.services.ClientApi.prototype.compileStyles = function( ){

    var model = new zz.ide.models.FilesTree();
    model.createLast( );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.COMPILE_CSS, model );
};

/**
 * Compile models.
 */
zz.ide.services.ClientApi.prototype.compileModels = function( ){

    var model = new zz.ide.models.FilesTree();
    model.createLast( );
    this.wsc_.sendCommandMessage( zz.ide.enums.Command.COMPILE_MODELS, model );
};

/**
 * Get search data.
 * @return {goog.Promise}
 */
zz.ide.services.ClientApi.prototype.getSearchData = function( ){

    return ( new goog.Promise( function( resolve, reject ){

        goog.net.XhrIo.send( '/lib/resources/searchdata.json', function( ){

            var data = this.getResponseJson( );
            resolve( data );
        } );
    }, this ) );
};



