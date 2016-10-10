/**
* @fileoverview Provide zz.ide base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.ide' );

goog.require( 'zz.ide.controllers.Application' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.ide.models.Application' );
goog.require( 'zz.environment.services.MVCTree' );

/**
* Base namespace for zz.ide module.
* @const
*/
zz.ide = zz.ide || { };

/**
* Bootstrap module method.
*/
zz.ide.bootstrap = function( ){


    /**
     * Application model.
     * @type {zz.ide.models.Application}
     */
    var appModel = new zz.ide.models.Application( );

    /**
     * Application view.
     * @type {zz.ide.views.Application}
     */
    var appView = new zz.ide.views.Application( );
    var appController = new zz.ide.controllers.Application( appModel, appView );
    window[ 'mvctree' ] = zz.environment.services.MVCTree.getInstance( );
};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );