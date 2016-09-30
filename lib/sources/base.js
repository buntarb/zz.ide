/**
* @fileoverview Provide zz.ide base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.ide' );

goog.require( 'zz.ide.controllers.Tree' );
goog.require( 'zz.ide.views.Tree' );
goog.require( 'zz.ide.models.Server' );
goog.require( 'zz.ide.models.Tree' );
goog.require( 'zz.ide.templates' );
goog.require( 'zz.ide.services.ClientApi' );

/**
* Base namespace for zz.ide module.
* @const
*/
zz.ide = zz.ide || { };

/**
* Bootstrap module method.
*/
zz.ide.bootstrap = function( ){

    var serverModel = new zz.ide.models.Server( );

    serverModel.createLast( [ 'root folder', 'folder' ] );
    serverModel.createLast( [ 'root file', 'file' ] );

    var uiModel = new zz.ide.models.Tree( );
    zz.ide.services.ClientApi.getInstance( ).convertModel( serverModel, uiModel );
    var controller = new zz.ide.controllers.Tree( uiModel );
};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );