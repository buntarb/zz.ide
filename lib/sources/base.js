/**
* @fileoverview Provide zz.ide base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.ide' );

goog.require( 'zz.ide.config' );

goog.require( 'zz.ide.controllers.Application' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.ide.models.Application' );

/**
* Bootstrap module method.
*/
zz.ide.bootstrap = function( ){

    /**
     * Application model.
     * @type {zz.ide.models.Application}
     */
    var appModel = new zz.ide.models.Application( undefined, [ [ 'imazzine dev team', 'zz.ide' ] ] );

    /**
     * Application view.
     * @type {zz.ide.views.Application}
     */
    var appView = new zz.ide.views.Application( );
    window[ 'controller' ] = new zz.ide.controllers.Application( appModel, appView );

    zz.ide.config( );
};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );