// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.Tooltip' );
goog.provide( 'zz.ide.models.TooltipDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.TooltipDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.text = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.TooltipDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.Tooltip = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.Tooltip, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.TooltipDatarow}
*/
zz.ide.models.Tooltip.prototype.DatarowConstructor = zz.ide.models.TooltipDatarow;

/**
* Return zz.ide.models.TooltipDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.Tooltip.prototype.getDatarowSchema = function( ){

return {
        text: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        }
};
};