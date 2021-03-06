// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.FilesTree' );
goog.provide( 'zz.ide.models.FilesTreeDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.FilesTreeDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.path = undefined;

    /**
     * @type {string}
     */
    this.path2 = undefined;

    /**
     * @type {string}
     */
    this.content = undefined;

    /**
     * @type {number}
     */
    this.type = undefined;

    /**
     * @type {string}
     */
    this.params = undefined;

    /**
     * @type {string}
     */
    this.stderr = undefined;

    /**
     * @type {zz.ide.models.FilesTree}
     */
    this.children = undefined;

    /**
     * @type {string}
     */
    this.stdout = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.FilesTreeDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.FilesTree = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.FilesTree, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.FilesTreeDatarow}
*/
zz.ide.models.FilesTree.prototype.DatarowConstructor = zz.ide.models.FilesTreeDatarow;

/**
* Return zz.ide.models.FilesTreeDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.FilesTree.prototype.getDatarowSchema = function( ){

return {
        path: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        path2: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        content: {
                index: 2,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        type: {
                index: 3,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        params: {
                index: 4,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        stderr: {
                index: 5,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        children: {
                index: 6,
                type: zz.ide.models.FilesTree,
                required: false
        },
        stdout: {
                index: 7,
                type: zz.models.enums.FieldType.STRING,
                required: false
        }
};
};