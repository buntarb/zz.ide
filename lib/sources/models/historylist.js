// This file was autogenerated by idk compile models.
// Please do not edit.

goog.provide( 'zz.ide.models.HistoryList' );
goog.provide( 'zz.ide.models.HistoryListDatarow' );

goog.require( 'zz.models.Datarow' );
goog.require( 'zz.models.Dataset' );
goog.require( 'zz.models.enums.FieldType' );



/**
* @param {!zz.models.Dataset} dataset
* @param {?Array.<string>} opt_data
* @extends {zz.models.Datarow}
* @constructor
*/
zz.ide.models.HistoryListDatarow = function( dataset, opt_data ){

    /**
     * @type {string}
     */
    this.name = undefined;

    /**
     * @type {string}
     */
    this.route = undefined;



/**
* Call parent constructor.
*/
zz.models.Datarow.call( this, dataset, opt_data );
};

goog.inherits( zz.ide.models.HistoryListDatarow, zz.models.Datarow );

/**
* @param {goog.event.EventTarget=} opt_parent
* @param {Array.<Array>=} opt_data
* @extends {zz.models.Dataset}
* @constructor
*/
zz.ide.models.HistoryList = function( opt_parent, opt_data ){

zz.models.Dataset.call( this, opt_parent, opt_data );
};
goog.inherits( zz.ide.models.HistoryList, zz.models.Dataset );

/**
* Current dataset row type.
* @constructor
* @overwrite
* @type {zz.ide.models.HistoryListDatarow}
*/
zz.ide.models.HistoryList.prototype.DatarowConstructor = zz.ide.models.HistoryListDatarow;

/**
* Return zz.ide.models.HistoryListDatarow schema object.
* @override
* @returns {Object}
*/
zz.ide.models.HistoryList.prototype.getDatarowSchema = function( ){

return {
        name: {
                index: 0,
                type: zz.models.enums.FieldType.STRING,
                required: true
        },
        route: {
                index: 1,
                type: zz.models.enums.FieldType.STRING,
                required: true
        }
};
};