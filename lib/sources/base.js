/**
* @fileoverview Provide zz.ide base object.
* @license Apache-2.0
* @author buntarb@gmail.com (Artem Lytvynov)
*/

goog.provide( 'zz.ide' );

goog.require( 'zz.ide.controllers.Tree' );
goog.require( 'zz.ide.views.Tree' );
goog.require( 'zz.ide.models.Tree' );
goog.require( 'zz.ide.templates' );

/**
* Base namespace for zz.ide module.
* @const
*/
zz.ide = zz.ide || { };

/**
* Bootstrap module method.
*/
zz.ide.bootstrap = function( ){

    var model = new zz.ide.models.Tree( );

    model.createLast( [ 'root folder', 'folder' ] );
    model.createLast( [ 'root file', 'file' ] );

    var controller = new zz.ide.controllers.Tree( model );
};

goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );