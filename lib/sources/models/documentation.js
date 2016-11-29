// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.Documentation' );
goog.provide( 'zz.ide.models.DocumentationDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.DocumentationDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.name = undefined;

    /**
     * @type {string}
     */
    this.kind = undefined;

    /**
     * @type {string}
     */
    this.description = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.DocumentationDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.Documentation = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.Documentation, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.DocumentationDatarow}
*/
zz.ide.models.Documentation.prototype.DatarowConstructor = zz.ide.models.DocumentationDatarow;

/**
* Return zz.ide.models.DocumentationDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.Documentation.prototype.getDatarowSchema = function( ){

return {
        name: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        kind: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        description: {
                index: 2,
                type: zz.models.enums.FieldType.STRING,
                required: false
        }
};
};