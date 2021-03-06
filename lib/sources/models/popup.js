// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.Popup' );
goog.provide( 'zz.ide.models.PopupDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.PopupDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.id = undefined;

    /**
     * @type {string}
     */
    this.title = undefined;

    /**
     * @type {number}
     */
    this.height = undefined;

    /**
     * @type {number}
     */
    this.width = undefined;

    /**
     * @type {number}
     */
    this.top = undefined;

    /**
     * @type {number}
     */
    this.left = undefined;

    /**
     * @type {string}
     */
    this.className = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.PopupDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.Popup = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.Popup, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.PopupDatarow}
*/
zz.ide.models.Popup.prototype.DatarowConstructor = zz.ide.models.PopupDatarow;

/**
* Return zz.ide.models.PopupDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.Popup.prototype.getDatarowSchema = function( ){

return {
        id: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        title: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        height: {
                index: 2,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        width: {
                index: 3,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        top: {
                index: 4,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        left: {
                index: 5,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        className: {
                index: 6,
                type: zz.models.enums.FieldType.STRING
        }
};
};