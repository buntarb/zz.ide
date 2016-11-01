/**
* @fileoverview Provide zz.ide base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.ide' );

goog.require( 'zz.app.services.FEBaseRouter' );
goog.require( 'zz.ide.config' );

goog.require( 'zz.ide.controllers.Application' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.ide.models.Application' );
goog.require( 'zz.environment.services.MVCTree' );
goog.require( 'zz.ide.controllers.Header' );
goog.require( 'zz.ide.views.Header' );
goog.require( 'zz.ide.controllers.Navigation' );
goog.require( 'zz.ide.views.Navigation' );
goog.require( 'zz.ide.controllers.Modal' );
goog.require( 'zz.ide.views.Modal' );
goog.require( 'zz.ide.controllers.Error' );
goog.require( 'zz.ide.views.Error' );

/**
* Base namespace for zz.ide module.
* @const
*/
zz.ide = zz.ide || { };

/**
* Bootstrap module method.
*/
zz.ide.bootstrap = function( ){

    zz.ide.config( );
    zz.app.services.FEBaseRouter.getInstance( ).bootstrap( );

    /**
     * Application model.
     * @type {zz.ide.models.Application}
     */
    var appModel = new zz.ide.models.Application( [ 'imazzine dev team', 'zz.ide' ] );

    /**
     * Application view.
     * @type {zz.ide.views.Application}
     */
    var appView = new zz.ide.views.Application( );
    var appController = new zz.ide.controllers.Application( appModel, appView );

};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );