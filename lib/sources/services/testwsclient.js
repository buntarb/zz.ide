/**
 * @license Apache-2.0
 * @copyright Artem Lytvynov <buntarb@gmail.com>
 */

var idk = require( 'imazzine-developer-kit' );

goog.provide( 'zz.ide.services.TestWSClient' );

goog.require( 'zz.net.WebSocketClient' );
goog.require( 'zz.ide.models.FilesTree' );
goog.require( 'zz.ide.enums.Const' );
goog.require( 'zz.ide.enums.Command' );
goog.require( 'zz.ide.enums.Path' );
goog.require( 'zz.net.enums.MessageType' );
goog.require( 'zz.environment.services.Environment' );

// goog.require( 'zz.ide.models.TernCompletions' );
// goog.require( 'zz.ide.models.TernCompletionsOut' );
goog.require( 'zz.ide.models.TernRequest' );
goog.require( 'zz.ide.models.TernResponse' );
goog.require( 'zz.ide.models.JSDocQuery' );

goog.require( 'zz.ide.models.WebServerRunner' );

goog.define( 'goog.DEBUG', false );
// goog.define( 'zz.net.URL', 'ws://localhost:7777' );

zz.ide.services.TestWSClient = function( url ){

    this.wsc_ = new zz.net.WebSocketClient( url );

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

    // this.eventHandler_.listenWithScope(
    //     this.wsc_,
    //
    //     // zz.net.enums.MessageType.ERROR,
    //     '0',
    //
    //     this.messageHandler_,
    //     false,
    //     this
    // );

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
        zz.ide.enums.Command.CREATE_FILE,
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

    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.IDK_HELP,
        this.messageHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.COMPILE_APP,
        this.messageHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.COMPILE_JS,
        this.messageHandler_,
        false,
        this
    );
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.COMPILE_CSS,
        this.messageHandler_,
        false
        ,this
    );

    //==================================Tern==================================================
    this.eventHandler_.listenWithScope(
        this.wsc_,
        zz.ide.enums.Command.TERN_REQUEST,
        this.ternResponseHandler_,
        false,
        this
    );

    //==================================jsdoc==================================================
    this.eventHandler_.listenWithScope(
        this.wsc_,
        [ zz.ide.enums.Command.JSDOC_DEFINITIONS, zz.ide.enums.Command.JSDOC_KEYWORDS ],
        this.jsdocHandler_,
        false,
        this
    );

    //==================================web server runner==================================================
    this.eventHandler_.listenWithScope(
        this.wsc_,
        [ zz.ide.enums.Command.START_SERVER, zz.ide.enums.Command.STOP_SERVER ],
        this.webServerRunnerHandler_,
        false,
        this
    );
};


zz.ide.services.TestWSClient.prototype.openHandler_ = function( ){

    console.log( '-------------OPEN-------------------' );
};

zz.ide.services.TestWSClient.prototype.webServerRunnerHandler_ = function( input ){

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

        model = new zz.ide.models.WebServerRunner( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = model.firstDatarow( );

        if( datarow.command === zz.ide.enums.Command.START_SERVER ){

            console.log( '========================RESPONSE START_SERVER========================' );

            console.log( 'modelDatarow.stderr = ' +  modelDatarow.stderr );

        }else if( datarow.command === zz.ide.enums.Command.STOP_SERVER ){

            console.log( '========================RESPONSE STOP_SERVER========================' );

            console.log( 'modelDatarow.stderr = ' +  modelDatarow.stderr );

        }else {

            console.log( '========================Unknown command: ' + datarow.command );

        }
    }
};

zz.ide.services.TestWSClient.prototype.jsdocHandler_ = function( input ){

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

        model = new zz.ide.models.JSDocQuery( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = model.firstDatarow( );

        if( datarow.command === zz.ide.enums.Command.JSDOC_DEFINITIONS ){

            console.log( '========================RESPONSE JSDOC_DEFINITIONS========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else {

                console.log('modelDatarow.result = ' + modelDatarow.result);
            }

        }else if( datarow.command === zz.ide.enums.Command.JSDOC_KEYWORDS ){

            console.log( '========================RESPONSE JSDOC_KEYWORDS========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else {

                console.log('modelDatarow.result = ' + modelDatarow.result);
            }

        }else {

            console.log( '========================Unknown command: ' + datarow.command );

        }
    }
};

zz.ide.services.TestWSClient.prototype.ternResponseHandler_ = function( input ){

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

        model = new zz.ide.models.TernResponse( null, goog.json.unsafeParse(datarow.data) );
        modelDatarow = model.firstDatarow( );

        if( datarow.command === zz.ide.enums.Command.TERN_REQUEST ){

            console.log( '========================RESPONSE TERN_REQUEST========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else {

                console.log('modelDatarow.response = ' + modelDatarow.response);
                console.log('modelDatarow.type = ' + modelDatarow.type);
            }

        }else {

            console.log( '========================Unknown command: ' + datarow.command );

        }
    }
};

zz.ide.services.TestWSClient.prototype.messageHandler_ = function( input ){

//    input.stopPropagation( );

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

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else {

                var childrenTree = modelDatarow.children;
                var currentRow = childrenTree.firstDatarow();
                while (currentRow) {

                    console.log(currentRow.type + ':\t' + currentRow.path);
                    currentRow = childrenTree.nextDatarow();
                }
            }

        }else if( datarow.command === zz.ide.enums.Command.OPEN_FILE ){

            console.log( '========================RESPONSE OPEN_FILE========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else{
                console.log( 'OK open' );
            }

            var content = modelDatarow.content;
            console.log( 'content = ' + content );

        }else if( datarow.command === zz.ide.enums.Command.SAVE_FILE ){

            console.log( '========================RESPONSE SAVE_FILE========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else{
                console.log( 'OK save' );
            }
        }else if( datarow.command === zz.ide.enums.Command.CREATE_FILE ){

            console.log( '========================RESPONSE CREATE_FILE========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else{
                console.log( 'OK create' );
            }
        }else if( datarow.command === zz.ide.enums.Command.REMOVE_FILE ){

            console.log( '========================RESPONSE REMOVE_FILE========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else{
                console.log( 'OK remove' );
            }

        }else if( datarow.command === zz.ide.enums.Command.COPY_FILE ){

            console.log( '========================RESPONSE COPY_FILE========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else{
                console.log( 'OK copy' );
            }

        }else if( datarow.command === zz.ide.enums.Command.RENAME_FILE ){

            console.log( '========================RESPONSE RENAME_FILE========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( modelDatarow.stderr );
            }else{
                console.log( 'OK rename' );
            }

        }else if( datarow.command === zz.ide.enums.Command.COMPILE_APP ){

            console.log( '========================RESPONSE COMPILE_APP========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( 'modelDatarow.stderr = ' + modelDatarow.stderr );
            }else{

                content = modelDatarow.stdout;
                console.log( 'content = ' + content );
            }

        }else if( datarow.command === zz.ide.enums.Command.IDK_HELP ){

            console.log( '========================RESPONSE IDK_HELP========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( 'modelDatarow.stderr = ' + modelDatarow.stderr );
            }else{

                content = modelDatarow.stdout;
                console.log( content );
            }
        }else if( datarow.command === zz.ide.enums.Command.COMPILE_JS ){

            console.log( '========================RESPONSE COMPILE_JS========================' );
            content = modelDatarow.stdout;
            console.log( content );
        }
        else if( datarow.command === zz.ide.enums.Command.COMPILE_CSS ){

            console.log( '========================RESPONSE COMPILE_CSS========================' );

            if( modelDatarow.stderr && '' !== modelDatarow.stderr ){

                console.log( 'modelDatarow.stderr = ' + modelDatarow.stderr );
            }else{

                content = modelDatarow.stdout;
                console.log( 'content = ' + content );
            }
        }
    }

    console.log( '========================End of capturing' );
};

zz.ide.services.TestWSClient.prototype.readyHandler_ = function( ){

    console.log("---------------Start test requests----------------");

    console.log('me = ' + client.wsc_.path_);

    var model = new zz.ide.models.WebServerRunner();

    model.createLast( [ ] );
    client.wsc_.sendCommandMessage( zz.ide.enums.Command.START_SERVER, model );

    setTimeout(function (){

        client.wsc_.sendCommandMessage( zz.ide.enums.Command.STOP_SERVER, model );

    },10000);



//    var jsdocModel = new zz.ide.models.JSDocQuery();
//    jsdocModel.createLast( [ 'createAt' ] );
//    // jsdocModel.createLast( [ 'lib/sources/base.js' ] );
//    client.wsc_.sendCommandMessage( zz.ide.enums.Command.JSDOC_DEFINITIONS, jsdocModel );
//
//    jsdocModel.deleteLast();
//    jsdocModel.createLast( [ 'zz' ] );
//    // jsdocModel.createLast( [ '/' ] );
//    client.wsc_.sendCommandMessage( zz.ide.enums.Command.JSDOC_KEYWORDS, jsdocModel );

    // var ternModel = new zz.ide.models.TernRequest();
    //
    // var query = {
    //     type: "completions",
    //     end: {line: 19, ch: 0},
    //     file: 'lib/sources/controllers/application.js',
    //     guess: true
    // };
    //
    // var text = idk.filetools.openFile('/var/www/zz.ide/lib/sources/controllers/application.js');
    // // console.log('text = ' + text);
    // // text = 'var a = undefined;';
    // // text = 'TwoObj\nline2 some2\nline3 sdf';
    //
    // ternModel.createLast( [ undefined, goog.json.serialize( [ {
    //     type: 'full',
    //     name: 'lib/sources/controllers/application.js',
    //     text: text
    // } ] ) ] );
    // // ternModel.createLast( [ 'lib/sources/services/ftservice.js', '9152' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.TERN_REQUEST, ternModel );
    //
    // setTimeout(function (){
    //
    //     query = {
    //         // type: "completions",
    //         // end: {line: 91, ch: 52},
    //         // file: 'lib/sources/services/ftservice.js',
    //         // guess: true
    //
    //         type: "type",
    //         end: {line: 0, ch: 0},
    //         file: 'lib/sources/controllers/application.js'
    //     };
    //
    //     ternModel.deleteLast();
    //     ternModel.createLast( [ goog.json.serialize( query ) ] );
    //     // ternModel.createLast( [ 'lib/sources/services/ftservice.js', '9152' ] );
    //     client.wsc_.sendCommandMessage( zz.ide.enums.Command.TERN_REQUEST, ternModel );
    //
    // },2000);

    // query = {
    //     // type: "completions",
    //     // end: {line: 91, ch: 52},
    //     // file: 'lib/sources/services/ftservice.js',
    //     // guess: true
    //
    //     type: "type",
    //     end: {line: 0, ch: 0},
    //     file: 'lib/sources/controllers/application.js'
    // };
    //
    // ternModel.deleteLast();
    // ternModel.createLast( [ goog.json.serialize( query ) ] );
    // // ternModel.createLast( [ 'lib/sources/services/ftservice.js', '9152' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.TERN_REQUEST, ternModel );


//    var model = new zz.ide.models.FilesTree();
//
//    model.createLast( [ ] );
////    client.wsc_.sendCommandMessage( zz.ide.enums.Command.IDK_HELP, model );
////    client.wsc_.sendCommandMessage( zz.ide.enums.Command.COMPILE_APP, model );
//    client.wsc_.sendCommandMessage( zz.ide.enums.Command.COMPILE_CSS, model );

    // model.deleteLast();
    // model.createLast( [ zz.ide.enums.Path.MODELS ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );
    //
    // // model.deleteLast();
    // // model.createLast( ['', , zz.ide.enums.Path.CONFIG_YAML] );
    // // client.wsc_.sendCommandMessage( zz.ide.enums.Command.GET_CHILDREN, model );
    //
    // model.deleteLast();
    // model.createLast( [ zz.ide.enums.Path.CONFIG_YAML ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.OPEN_FILE, model );
    //
    // model.deleteLast();
    // model.createLast( ['testSaveFile.txt', undefined, 'some content' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.SAVE_FILE, model );
    //
    // model.deleteLast();
    // model.createLast( ['', , 'noFile.txt'] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.OPEN_FILE, model );
    //
    // model.deleteLast();
    // model.createLast( ['testSaveFile.txt', 'testSaveFileCopy.txt' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.COPY_FILE, model );
    //
    // model.deleteLast();
    // model.createLast( ['testSaveFile.txt' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.REMOVE_FILE, model );
    //
    // model.deleteLast();
    // model.createLast( ['testSaveFileCopy.txt', 'testSaveFileRenamed.txt' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.RENAME_FILE, model );
    //
    // model.deleteLast();
    // model.createLast( ['testCreateFile.txt', undefined, 'some content on create file' ] );
    // client.wsc_.sendCommandMessage( zz.ide.enums.Command.CREATE_FILE, model );

    console.log("---------------End test requests----------------");

};


var client = new zz.ide.services.TestWSClient( 'ws://localhost:9999' );