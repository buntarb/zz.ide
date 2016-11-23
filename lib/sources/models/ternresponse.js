// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.TernResponse' );
goog.provide( 'zz.ide.models.TernResponseDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.TernResponseDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.type = undefined;

    /**
     * @type {string}
     */
    this.response = undefined;

    /**
     * @type {string}
     */
    this.stderr = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.TernResponseDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.TernResponse = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.TernResponse, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.TernResponseDatarow}
*/
zz.ide.models.TernResponse.prototype.DatarowConstructor = zz.ide.models.TernResponseDatarow;

/**
* Return zz.ide.models.TernResponseDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.TernResponse.prototype.getDatarowSchema = function( ){

return {
        type: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: true
        },
        response: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        stderr: {
                index: 2,
                type: zz.models.enums.FieldType.STRING,
                required: false
        }
};
};