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
goog.require( 'zz.ide.controllers.Layout' );
goog.require( 'zz.ide.views.Layout' );
goog.require( 'zz.ide.controllers.View' );
goog.require( 'zz.ide.views.View' );
goog.require( 'zz.ide.controllers.Header' );
goog.require( 'zz.ide.views.Header' );
goog.require( 'zz.ide.controllers.Navigation' );
goog.require( 'zz.ide.views.Navigation' );
goog.require( 'zz.ide.controllers.Ace' );
goog.require( 'zz.ide.views.Ace' );
goog.require( 'zz.ide.controllers.Blankfolder' );
goog.require( 'zz.ide.views.Blankfolder' );
goog.require( 'zz.ide.controllers.Filelist' );
goog.require( 'zz.ide.views.Filelist' );

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
};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );