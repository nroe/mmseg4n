/**
 * mmseg4j 分词的 nodejs 实现，并提供 HTTP 服务
 * 
 * USAGE: node main.js
 *     --dic-dir=[词典目录，默认 src/Seg/data]
 *     --host=[HTTP 服务绑定主机名，默认 127.0.0.1]
 *     --port=[HTTP 服务绑定端口，默认 8085]
 * 
 * @author Nroe
 * @package MMSeg4N
 */
 
var path = require("path"),
    http = require( "http" );

ROOT_PATH = path.dirname(__filename);
JSCLASS_PATH = ROOT_PATH + '/lib/JS.Class/src';

require(JSCLASS_PATH + '/loader');
JS.require('JS.Console');
JS.require('JS.Class');
JS.require('JS.Hash');
require(ROOT_PATH + "/RestServer.js");
require(ROOT_PATH + "/AnalyserResource.js");

var argv = require(ROOT_PATH + "/lib/optimist/optimist.js")
    .demand( [ "dic-dir", "host", "port" ] )
    .argv;

var DIC_DIR = argv[ "dic-dir" ],
    HOST = argv[ "host" ],
    PORT = argv[ "port" ];


(function() {
    var pathRewriteTable = {
        "/": "/Index",
        "/literal/": "/literal/Index",
        "/favicon.ico": "/res/favicon.ico"
    };
    
    var resources = [ new AnalyserResource(DIC_DIR) ];
    
    
    var server = new RestServer(HOST, PORT, resources);
    server.setPathRewrite(pathRewriteTable);
    
    server.start();
}());

console.log( "Server running at http://" + HOST + ":" + PORT + "/" );
