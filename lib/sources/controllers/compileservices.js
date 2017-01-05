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

goog.provide( 'zz.ide.controllers.CompileServices' );

goog.require( 'goog.dom.classlist' );

goog.require( 'zz.environment.services.Environment' );
goog.require( 'zz.ide.services.ConstantsConverter' );

goog.require( 'zz.ide.services.ClientApi' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ui.controllers.List' );
goog.require( 'zz.controllers.enums.EventType' );
goog.require( 'zz.environment.services.MVCRegistry' );
goog.require( 'zz.environment.services.Environment' );

goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.CssClass' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ui.enums.EventType' );

goog.require( 'zz.ide.views.Services' );

/**
 * Services controller.
 * @param {zz.ide.models.Services} model
 * @param {zz.ide.views.Services} view
 * @constructor
 * @extends {zz.ui.controllers.List}
 */

zz.ide.controllers.CompileServices  = class extends zz.ui.controllers.List {

    /**
     * @param {zz.ui.models.List} model
     * @param {zz.ui.views.List} view
     */
    constructor( model, view ){

        view = view || zz.ide.views.Services.getInstance( );

        super( model, view );
        this.wsc_ = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getWSClient( );

        this.layout_ = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getLayoutController( );

        this.router_ = zz.environment.services.Environment

            .getInstance( )
            .getRootController( )
            .getRouter( );

        /**
         * Id for compiling
         * @type {string}
         * @private
         */
        this.startCompilingId_ = '';
    }

    setupListenersInternal( ){

        super.setupListenersInternal( );

        this.getHandler( ).listen(

            this,
            zz.ui.enums.EventType.LIST_ITEM_ACTION,
            this.actionHandler_,
            false
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.COMPILE_APP,
            this.compileMessageHandler_,
            false,
            this
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.SAVE_FILE,
            this.saveFileHandler_,
            false,
            this
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.COMPILE_SOY,
            this.compileMessageHandler_,
            false,
            this
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.COMPILE_CSS,
            this.compileMessageHandler_,
            false,
            this
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.COMPILE_MODELS,
            this.compileMessageHandler_,
            false,
            this
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.CALCDEPS,
            this.compileMessageHandler_,
            false,
            this
        );
        this.getHandler( ).listenWithScope(

            this.wsc_,
            zz.ide.enums.Command.EXTRACTMSG,
            this.compileMessageHandler_,
            false,
            this
        );

        this.getHandler( ).listenWithScope(

            this,
            zz.controllers.enums.EventType.LEAVE,
            this.compileLeaveHandler_,
            false,
            this
        );
        
        this.getHandler( ).listenWithScope(

            this,
            zz.controllers.enums.EventType.ENTER,
            this.compileEnterHandler_,
            false,
            this
        );
    };
};

zz.environment.services.MVCRegistry.setController( 'compileServices', zz.ide.controllers.CompileServices );

/**
 *  @override
 */
zz.ide.controllers.CompileServices.prototype.setupModelInternal = function( ){

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.COMPILE_APP,
            zz.ide.enums.CssClass.COMPILE_APP,
            false,
            false,
            zz.ide.enums.Const.ICON_BUILD,
            undefined,
            undefined
        ] );

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.EXTRACT_MSG,
            zz.ide.enums.CssClass.EXTRACT_MSG,
            false,
            false,
            zz.ide.enums.Const.ICON_MESSAGES,
            undefined,
            undefined
        ] );

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.CALC_DEPS,
            zz.ide.enums.CssClass.CALC_DEPS,
            false,
            false,
            zz.ide.enums.Const.ICON_FOLDER,
            undefined,
            undefined
        ] );

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.COMPILE_CSS,
            zz.ide.enums.CssClass.COMPILE_CSS,
            false,
            false,
            zz.ide.enums.Const.ICON_STYLES,
            undefined,
            undefined
        ] );

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.COMPILE_SOY,
            zz.ide.enums.CssClass.COMPILE_SOY,
            false,
            false,
            zz.ide.enums.Const.ICON_TEMPLATES,
            undefined,
            undefined
        ] );

    this
        .getModel( )
        .createLast( [

            undefined,
            zz.ide.enums.CssClass.COMPILE_MODELS,
            zz.ide.enums.CssClass.COMPILE_MODELS,
            false,
            false,
            zz.ide.enums.Const.ICON_MODELS,
            undefined,
            undefined
        ] );
};

/**
 *  @override
 */
zz.ide.controllers.CompileServices.prototype.bootstrap = function( ){

    this.getView( ).addSelector( this, zz.ide.enums.CssClass.COMPILE_SERVICES );
};

/**
 * Action event handler.
 * @param {zz.ui.enums.EventType.LIST_ITEM_ACTION} e
 * @private
 */
zz.ide.controllers.CompileServices.prototype.actionHandler_ = function( e ){

    var command = zz.ide.services.ConstantsConverter.getInstance( ).getCommandFromId( e.model.id );

    if( goog.dom.pattern.matchStringOrRegex( /file=/g, this.router_.getFragment( ) ) ){

        this.startCompilingId_ =  command;
        this.layout_.getViewCtrl( ).saveFile( );

    }else {

        this.startCompiling( command, e.model.id, e.model.icon );
    }

    e.stopPropagation( );
};

/**
 * WS message event handler.
 * @param {zz.net.events.WebSocketClientMessage} e
 * @private
 */
zz.ide.controllers.CompileServices.prototype.compileMessageHandler_ = function( e ){

    var compilerMessageModel =
        new zz.ide.models.FilesTree( undefined, e.getDataJson( ) );

    if( compilerMessageModel.firstDatarow( ).stdout
        && compilerMessageModel.firstDatarow( ).stdout.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            undefined,
            undefined,
            undefined,
            compilerMessageModel

                .firstDatarow( )
                .stdout );
    }
    if( compilerMessageModel.firstDatarow( ).stderr
        && compilerMessageModel.firstDatarow( ).stderr.length ){

        this.layout_.openError(

            true,
            false,
            100,
            200,
            'Error',
            undefined,
            undefined,
            compilerMessageModel

                .firstDatarow( )
                .stderr );
    }else{

        console.log( 'compile respond', e );
    }
    this.finishCompiling( e.type );
};

/**
 * Save file event handler.
 * @param {zz.controllers.events.Action} e
 * @private
 */
zz.ide.controllers.CompileServices.prototype.saveFileHandler_ = function( e ){

    if( this.startCompilingId_ ){

        this.startCompiling( this.startCompilingId_ );
        this.startCompilingId_ = '';
    }
    e.stopPropagation( );
};

/**
 *  Start compile files.
 *  @param {string} command
 *  @param {string} id
 *  @param {string} icon
 */
zz.ide.controllers.CompileServices.prototype.startCompiling = function( command, id, icon ){

    switch( command ){

        case zz.ide.enums.Command.COMPILE_APP:

            zz.ide.services.ClientApi.getInstance( ).compileApp( );
            this.layout_.setCompilingStatus( true );
            break;

        case zz.ide.enums.Command.COMPILE_SOY:

            zz.ide.services.ClientApi.getInstance( ).compileSoy( );
            this.layout_.setCompilingStatus( true );

            break;

        case zz.ide.enums.Command.COMPILE_CSS:

            zz.ide.services.ClientApi.getInstance( ).compileStyles( );
            this.layout_.setCompilingStatus( true );

            break;

        case zz.ide.enums.Command.COMPILE_MODELS:

            zz.ide.services.ClientApi.getInstance( ).compileModels( );
            this.layout_.setCompilingStatus( true );

            break;

        case zz.ide.enums.Command.CALCDEPS:

            zz.ide.services.ClientApi.getInstance( ).calculateDeps( );
            this.layout_.setCompilingStatus( true );

            break;

        case zz.ide.enums.Command.EXTRACTMSG:

            zz.ide.services.ClientApi.getInstance( ).extractMsg( );
            this.layout_.setCompilingStatus( true );

            break;
    }

    goog.dom.classlist.add(

        goog.dom.getElement( zz.ide.enums.CssClass.COMPILE_APP ),
        zz.ide.enums.CssClass.COMPILING
    );

    if( id !== zz.ide.enums.CssClass.COMPILE_APP ){

        goog.dom.classlist.add(

            goog.dom.getElement( id ),
            zz.ide.enums.CssClass.COMPILING
        );
    }
    icon = zz.ide.enums.Const.ICON_AUTORENEW;
};


/**
 *  Finish compiling
 *  @param {string} command
 */
zz.ide.controllers.CompileServices.prototype.finishCompiling = function( command ){

    var selector;
    var model = this.getModel( );

    switch( command ){

        case zz.ide.enums.Command.COMPILE_APP:

            selector = zz.ide.enums.CssClass.COMPILE_APP;
            this.layout_.setCompilingStatus( false );
            break;

        case zz.ide.enums.Command.COMPILE_SOY:

            this.layout_.setCompilingStatus( false );
            selector = zz.ide.enums.CssClass.COMPILE_SOY;

            break;

        case zz.ide.enums.Command.COMPILE_MODELS:

            this.layout_.setCompilingStatus( false );
            selector = zz.ide.enums.CssClass.COMPILE_MODELS;

            break;

        case zz.ide.enums.Command.COMPILE_CSS:

            this.layout_.setCompilingStatus( false );
            selector = zz.ide.enums.CssClass.COMPILE_CSS;

            break;

        case zz.ide.enums.Command.CALCDEPS:

            this.layout_.setCompilingStatus( false );
            selector = zz.ide.enums.CssClass.CALC_DEPS;

            break;

        case zz.ide.enums.Command.EXTRACTMSG:

            this.layout_.setCompilingStatus( false );
            selector = zz.ide.enums.CssClass.EXTRACT_MSG;

            break;
    }

    goog.dom.classlist.remove(

        goog.dom.getElement( zz.ide.enums.CssClass.COMPILE_APP ),
        zz.ide.enums.CssClass.COMPILING
    );

    if( selector !== zz.ide.enums.CssClass.COMPILE_APP ){

        goog.dom.classlist.remove(

            goog.dom.getElement( selector ),
            zz.ide.enums.CssClass.COMPILING
        );
    }

    if( model.firstDatarow( ) ){

        var loop = true;
        while( loop ){

            if( model.currentDatarow( ).id === selector ){

                model.currentDatarow( ).icon =

                    zz.ide.services.ConstantsConverter.getInstance( ).getIconFromId( selector );

                loop = false;

            }else{

                model.nextDatarow( );
            }
        }
    }
};