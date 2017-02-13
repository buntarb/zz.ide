// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.DocumentationParams' );
goog.provide( 'zz.ide.models.DocumentationParamsDatarow' );

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
zz.ide.models.DocumentationParamsDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.name = undefined;

    /**
     * @type {zz.ide.models.DocumentationParamsType}
     */
    this.type = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.DocumentationParamsDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.DocumentationParams = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.DocumentationParams, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.DocumentationParamsDatarow}
*/
zz.ide.models.DocumentationParams.prototype.DatarowConstructor = zz.ide.models.DocumentationParamsDatarow;

/**
* Return zz.ide.models.DocumentationParamsDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.DocumentationParams.prototype.getDatarowSchema = function( ){

return {
        name: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        type: {
                index: 1,
                type: zz.ide.models.DocumentationParamsType,
                required: false
        }
};
};