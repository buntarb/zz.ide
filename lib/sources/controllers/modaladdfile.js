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

goog.provide( 'zz.ide.controllers.ModalAddFile' );

goog.require( 'goog.dom.pattern' );
goog.require( 'goog.string.html' );

goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Route' );

goog.require( 'zz.ide.services.Content' );
goog.require( 'zz.ide.views.ModalAddFile' );
goog.require( 'zz.ide.models.Filelist' );

goog.require( 'zz.controllers.FEBase' );
goog.require( 'zz.environment.services.Environment' );

/**
 * ModalAddFile controller.
 * @param {string} path
 * @param opt_dom
 * @constructor
 * @extends {zz.controllers.FEBase}
 */
zz.ide.controllers.ModalAddFile = function( path, opt_dom ){

    this.path_ = path;

    /**
     * Modal window for delete file model.
     * @type {zz.ide.models.Filelist}
     */
    var modalAddModel = new zz.ide.models.Filelist( );

    modalAddModel.createLast( ['', 2, this.path_] );

    /**
     * Modal window for delete file view.
     * @type {zz.ide.views.ModalAddFile}
     */
    var modalAddView = zz.ide.views.ModalAddFile.getInstance( );

    goog.base( this, modalAddModel, modalAddView, opt_dom );

    this.router_ = zz.environment.services.Environment

        .getInstance( )
        .getRootController( )
        .getRouter( );
};

goog.inherits( zz.ide.controllers.ModalAddFile, zz.controllers.FEBase );

/**
 *  @override
 */
zz.ide.controllers.ModalAddFile.prototype.setupListenersInternal = function( ){

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.ACTION,
        this.actionHandler_,
        false
    );

    this.getHandler( ).listen(

        this,
        zz.controllers.enums.EventType.INPUT,
        this.inputHandler_,
        false
    );
};

/**
 * Action event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.ModalAddFile.prototype.actionHandler_ = function( e ){

    if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.CLOSE_MODAL ) ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .closeModal( );

    }else if( e.elements[ 0 ].getAttribute( zz.ide.enums.DataAction.SAVE ) ){

        if( this.addFile_ ){

            var filelistModel = zz.environment.services.Environment

                .getInstance( )
                .getRootController( )
                .getLayoutController( )
                .getViewController( )
                .getModel( );

            var loop = true;
            var addFile = false;
            var fileType;

            switch( this.router_.getFragment( ) ){

                case zz.ide.enums.Route.MODELS:

                    fileType = zz.ide.enums.Const.YAML;
                    break;

                case zz.ide.enums.Route.TEMPLATES:

                    fileType = zz.ide.enums.Const.SOY;
                    break;

                case zz.ide.enums.Route.STYLES:

                    fileType = zz.ide.enums.Const.SCSS;
                    break;

                case zz.ide.enums.Route.MESSAGES:

                    fileType = zz.ide.enums.Const.SOY;
                    break;

                case zz.ide.enums.Route.INDEX:

                    fileType = zz.ide.enums.Const.TPL;
                    break;

                case zz.ide.enums.Route.CONTROLLERS:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.ENUMS:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.ERRORS:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.EVENTS:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.FACTORIES:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.SERVICES:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.VIEWS:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                case zz.ide.enums.Route.TESTS:

                    fileType = zz.ide.enums.Const.JS;
                    break;

                default:

                    break;
            }

            var filename = goog.string.html.toLowerCase( e.model.name ) + '.' + fileType;

            if ( filelistModel.firstDatarow( ) ){

                while ( loop ){

                    if ( filelistModel.currentDatarow( ).name !== filename ){

                        addFile = true;
                        loop = filelistModel.nextDatarow( );

                    }else{

                        addFile = false;
                        loop = false;
                    }
                }
            }else if( !filelistModel.length ){

                addFile = true;
            }
            if( addFile ){

                var content = zz.ide.services.Content.getInstance( ).get( e.model.name, this.router_.getFragment( ) );
                zz.ide.services.ClientApi.getInstance( ).createFile(

                    filename, e.model.path, content, e.model.type );

                zz.environment.services.Environment

                    .getInstance( )
                    .getRootController( )
                    .getLayoutController( )
                    .closeModal( );

            }else{

                zz.environment.services.Environment

                    .getInstance( )
                    .getRootController( )
                    .getLayoutController( )
                    .getModel( ).lastDatarow( )
                    .modal.lastDatarow( )
                    .title = 'The same namespace "' + e.model.name + '" is already exist';
            }
        }
    }
    e.stopPropagation( );
};

/**
 * Input event handler.
 * @param  e
 * @private
 */
zz.ide.controllers.ModalAddFile.prototype.inputHandler_ = function( e ){

    this.addFile_ = goog.dom.pattern.matchStringOrRegex( /^[a-zA-Z][a-zA-Z0-9]+$/, e.newValue );

    if( !this.addFile_ ){

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getModel( ).lastDatarow( )
            .modal.lastDatarow( )
            .title = 'Namespace should consist of lower, upper case, numbers and start with a letter. Min 2 symbols.';
    }else{

        zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( )
            .getModel( ).lastDatarow( )
            .modal.lastDatarow( )
            .title = '';
    }
};