// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.DocumentationProperty' );
goog.provide( 'zz.ide.models.DocumentationPropertyDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );

goog.require( 'zz.ide.models.DocumentationParamsType' );


/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.DocumentationPropertyDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.name = undefined;

    /**
     * @type {string}
     */
    this.description = undefined;

    /**
     * @type {zz.ide.models.DocumentationParamsType}
     */
    this.type = undefined;

    /**
     * @type {boolean}
     */
    this.open = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.DocumentationPropertyDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.DocumentationProperty = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.DocumentationProperty, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.DocumentationPropertyDatarow}
*/
zz.ide.models.DocumentationProperty.prototype.DatarowConstructor = zz.ide.models.DocumentationPropertyDatarow;

/**
* Return zz.ide.models.DocumentationPropertyDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.DocumentationProperty.prototype.getDatarowSchema = function( ){

return {
        name: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        description: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        type: {
                index: 2,
                type: zz.ide.models.DocumentationParamsType,
                required: false
        },
        open: {
                index: 3,
                type: zz.models.enums.FieldType.BOOLEAN,
                required: false
        }
};
};