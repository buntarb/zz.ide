<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <link rel="stylesheet" href="/[{(PATH.BIN)}]/[{(NAMESPACE)}].css">
        <script>window[ 'WS_SERVER_HOST' ] = '[{(IDE.WS_SERVER_HOST)}]';</script>
        <script>window[ 'WS_SERVER_PORT' ] = '[{(IDE.WS_SERVER_PORT)}]';</script>
        <script>window[ 'WS_SERVER_PATH' ] = '[{(IDE.WS_SERVER_PATH)}]';</script>
        <script src="/[{(PATH.BIN)}]/[{(NAMESPACE)}].tst.js"></script>
        <script src="/node_modules/imazzine-developer-kit/node_modules/ace-builds/src-min/ace.js"></script>
        <script src="/node_modules/imazzine-developer-kit/node_modules/ace-builds/src-min/ext-language_tools.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script>[{(NAMESPACE)}].bootstrap( );</script>
    </body>
</html>