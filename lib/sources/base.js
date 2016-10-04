/**
* @fileoverview Provide zz.ide base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.ide' );

goog.require( 'zz.ide.controllers.Application' );
goog.require( 'zz.ide.views.Application' );
goog.require( 'zz.ide.models.Application' );

/**
* Base namespace for zz.ide module.
* @const
*/
zz.ide = zz.ide || { };

/**
* Bootstrap module method.
*/
zz.ide.bootstrap = function( ){

    var appModel = new zz.ide.models.Application( );
    appModel.createLast( );
    var appController = new zz.ide.controllers.Application( appModel );
};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );