// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.Ace' );
goog.provide( 'zz.ide.models.AceDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );

goog.require( 'zz.ide.models.HistoryList' );


/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.AceDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.theme = undefined;

    /**
     * @type {string}
     */
    this.syntax = undefined;

    /**
     * @type {number}
     */
    this.height = undefined;

    /**
     * @type {string}
     */
    this.content = undefined;

    /**
     * @type {string}
     */
    this.name = undefined;

    /**
     * @type {number}
     */
    this.type = undefined;

    /**
     * @type {string}
     */
    this.path = undefined;

    /**
     * @type {string}
     */
    this.search = undefined;

    /**
     * @type {number}
     */
    this.numberOfLines = undefined;

    /**
     * @type {number}
     */
    this.lineNumber = undefined;

    /**
     * @type {number}
     */
    this.columnNumber = undefined;

    /**
     * @type {zz.ide.models.Services}
     */
    this.services = undefined;

    /**
     * @type {zz.ide.models.HistoryList}
     */
    this.tabs = undefined;

    /**
     * @type {boolean}
     */
    this.showHistory = undefined;

    /**
     * @type {boolean}
     */
    this.canRedo = undefined;

    /**
     * @type {boolean}
     */
    this.canUndo = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.AceDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.Ace = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.Ace, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.AceDatarow}
*/
zz.ide.models.Ace.prototype.DatarowConstructor = zz.ide.models.AceDatarow;

/**
* Return zz.ide.models.AceDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.Ace.prototype.getDatarowSchema = function( ){

return {
        theme: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        syntax: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        height: {
                index: 2,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        content: {
                index: 3,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        name: {
                index: 4,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        type: {
                index: 5,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        path: {
                index: 6,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        search: {
                index: 7,
                type: zz.models.enums.FieldType.STRING,
                required: false
        },
        numberOfLines: {
                index: 8,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        lineNumber: {
                index: 9,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        columnNumber: {
                index: 10,
                type: zz.models.enums.FieldType.NUMBER,
                required: false
        },
        services: {
                index: 11,
                type: zz.ide.models.Services,
                required: false
        },
        tabs: {
                index: 12,
                type: zz.ide.models.HistoryList,
                required: false
        },
        showHistory: {
                index: 13,
                type: zz.models.enums.FieldType.BOOLEAN,
                required: false
        },
        canRedo: {
                index: 14,
                type: zz.models.enums.FieldType.BOOLEAN,
                required: false
        },
        canUndo: {
                index: 14,
                type: zz.models.enums.FieldType.BOOLEAN,
                required: false
        }
};
};