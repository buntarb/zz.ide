/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.TestWSClient' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.net.enums.MessageType' );
goog.require( 'zz.environment.services.Environment' );

goog.define( 'goog.DEBUG', false );

zz.ide.services.TestWSClient = function( url, opt_protocol ){

    this.wsc_ = new zz.net.WebSocketClient( url, opt_protocol );

    this.eventHandler_ = new goog.events.EventHandler( );

    // goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_OPEN, this.openHandler_ );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_OPEN,
        this.openHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.net.enums.EventType.WEB_SOCKET_READY,
        this.readyHandler_,
        false,
        this
    );

    // goog.events.listen( this.wsc_, zz.net.enums.EventType.WEB_SOCKET_MESSAGE, this.messageHandler_ );


    // goog.events.listen( this.wsc_, zz.ide.enums.Command.GET_CHILDREN, this.messageHandler_ );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.GET_CHILDREN,
        this.messageHandler_,
        false,
        this
    );
    // goog.events.listen( this.wsc_, zz.ide.enums.Command.OPEN_FILE, this.messageHandler_ );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.OPEN_FILE,
        this.messageHandler_,
        false,
        this
    );
    // goog.events.listen( this.wsc_, zz.ide.enums.Command.SAVE_FILE, this.messageHandler_ );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.SAVE_FILE,
        this.messageHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.REMOVE_FILE,
        this.messageHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.COPY_FILE,
        this.messageHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.RENAME_FILE,
        this.messageHandler_,
        false,
        this
    );
};


zz.ide.services.TestWSClient.prototype.openHandler_ = function( ){

    console.log( '-------------OPEN-------------------' );
};

zz.ide.services.TestWSClient.prototype.messageHandler_ = function( input ){

    var data = input;

    var dataset = new zz.net.models.MessageDataset( null, data.messageData );
    var datarow = /** @type {zz.net.models.MessageDatarow} */ ( dataset.firstDatarow( ) );
    var model;
    var modelDatarow;

    if( datarow.type === zz.net.enums.MessageType.ERROR ){

        console.log( '========================RESPONSE ERROR========================' );

        model = new zz.net.models.ErrorDataset( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = /** @type {zz.net.models.ErrorDatarow} */ ( model.firstDatarow( ) );
        console.log( modelDatarow.code + ': ' + modelDatarow.message );

    }else{

        model = new zz.ide.models.FilesTree( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = /** @type {zz.net.models.MessageDatarow} */ ( model.firstDatarow( ) );

        if( datarow.command === zz.ide.enums.Command.GET_CHILDREN ){

            console.log( '========================RESPONSE GET_CHILDREN========================' );
            var childrenTree = modelDatarow.children;
            var currentRow = childrenTree.firstDatarow();
            while ( currentRow ){

                console.log( currentRow.type + ':\t' + currentRow.name + ':\t\t' + currentRow.path );
                currentRow = childrenTree.nextDatarow();
            }

        }else if( datarow.command === zz.ide.enums.Command.OPEN_FILE ){

            console.log( '========================RESPONSE OPEN_FILE========================' );
            var content = modelDatarow.content;
            console.log( content );

        }else if( datarow.command === zz.ide.enums.Command.SAVE_FILE ){

            console.log( '========================RESPONSE SAVE_FILE========================' );
            var content = modelDatarow.content;
            console.log( content );
        }else if( datarow.command === zz.ide.enums.Command.REMOVE_FILE ){

            console.log( '========================RESPONSE REMOVE_FILE========================' );
        }else if( datarow.command === zz.ide.enums.Command.COPY_FILE ){

            console.log( '========================RESPONSE COPY_FILE========================' );
        }else if( datarow.command === zz.ide.enums.Command.RENAME_FILE ){

            console.log( '========================RESPONSE RENAME_FILE========================' );
        }
    }
};

zz.ide.services.TestWSClient.prototype.readyHandler_ = function( ){

    console.log("---------------Start test requests----------------");

    var model = new zz.ide.models.FilesTree();

    model.createLast( ['models', zz.ide.enums.Const.FOLDER, zz.ide.enums.Path.MODELS, ''] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );

    // model.deleteLast();
    // model.createLast( ['', , zz.ide.enums.Path.CONFIG_YAML] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );

    model.deleteLast();
    model.createLast( ['', , zz.ide.enums.Path.CONFIG_YAML] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.OPEN_FILE, model );

    model.deleteLast();
    model.createLast( ['', , 'testSaveFile.txt', 'some content' ] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.SAVE_FILE, model );

    // model.deleteLast();
    // model.createLast( ['', , 'noFile.txt'] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.OPEN_FILE, model );

    model.deleteLast();
    model.createLast( ['testSaveFileCopy.txt', , 'testSaveFile.txt', '' ] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.COPY_FILE, model );

    model.deleteLast();
    model.createLast( ['', , 'testSaveFile.txt', 'some content' ] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.REMOVE_FILE, model );

    model.deleteLast();
    model.createLast( ['testSaveFileRenamed.txt', , 'testSaveFileCopy.txt', '' ] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.RENAME_FILE, model );

    console.log("---------------End test requests----------------");

};


var client = new zz.ide.services.TestWSClient( 'ws://localhost:7777' );