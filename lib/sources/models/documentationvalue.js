// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.DocumentationValue' );
goog.provide( 'zz.ide.models.DocumentationValueDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.DocumentationValueDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.name = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.DocumentationValueDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.DocumentationValue = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.DocumentationValue, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.DocumentationValueDatarow}
*/
zz.ide.models.DocumentationValue.prototype.DatarowConstructor = zz.ide.models.DocumentationValueDatarow;

/**
* Return zz.ide.models.DocumentationValueDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.DocumentationValue.prototype.getDatarowSchema = function( ){

return {
        name: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        }
};
};