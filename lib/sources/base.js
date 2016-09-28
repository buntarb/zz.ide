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
    var view = new zz.ide.views.Tree( );
    var controller = new zz.ide.controllers.Tree( model, view );
    controller.getModel( ).createLast( [ 'root folder', 'folder' ] );
    controller.getModel( ).createLast( [ 'root file', 'file' ] );

    //var view = new zz.views.FEBase( zz.ide.treenode.dataset, zz.ide.treenode.datarow );
    //var rootModel = new zz.ide.models.TreeNode( );
    //var rootController = new zz.controllers.FEBase( rootModel, view );
    //rootModel.createLast( [ 'Root model node' ] );
    //
    //var model = rootModel.lastDatarow( ).children;
    //var controller = new zz.controllers.FEBase( model, view );
    //rootController.addFieldController(
    //
    //    rootModel.lastDatarow( ),
    //    rootModel.datafield.children,
    //    controller );
    //
    //model.createLast( [ 'Model node' ] );
    //
    //var subModel = model.lastDatarow( ).children;
    //var subController = new zz.controllers.FEBase( subModel, view );
    //controller.addFieldController(
    //
    //    model.lastDatarow( ),
    //    model.datafield.children,
    //    subController );
    //
    //subModel.createLast( [ 'Sub model node' ] );
    //console.log( rootController );
};
goog.exportSymbol( 'zz.ide.bootstrap', zz.ide.bootstrap );