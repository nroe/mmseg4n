/**
 * 
 * @author Nroe
 * @package MMSeg4N
 */
var sys = require('sys');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

require(ROOT_PATH + '/Lang.js');

RestServer = new JS.Class({
    host: null,
    port: null,
    resources: [],
    httpServer: null,
    pathRewriteTable: [],
    
    initialize: function(host, port, resources) {
        this.host = host;
        this.port = port;
        this.resources = resources;
        this.httpServer = http.createServer(Lang.prototype.hitch(this, '_onServerRequest'));
    },
    
    setPathRewrite: function(pathRewriteTable)
    {
        this.pathRewriteTable = pathRewriteTable;
    },
    
    start: function() {
        this.httpServer.listen(this.port, this.host);
    },
    
    stop: function() {
        this.httpServer.close();
    },
    

    
    _onServerRequest: function(req, res) {
        var resource = this.findResource(req);
        var processed = false;
        if (resource) {
            processed = this.processRequest(resource, req, res);
        }
        if (!processed) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not found, no matching resources!\n')
            res.end();
        }
    },
    
    findResource: function(req) {
        var reqUrl = url.parse( req.url );
        var reqPath = reqUrl.pathname;
        
        // rewrite path
        var reqRewrite = this.pathRewriteTable[ reqPath ];
        
        if (reqRewrite) {
            reqPath = reqRewrite;
            req.url = reqPath;
        }
       
        var reqUrl = url.parse(req.url);
        sys.puts('find resource for request: url=' + req.url + ',pathname=' + reqUrl.pathname);
        for (var i = 0; i < this.resources.length; i++) {
        if (this.resources[i].path.test(reqPath)) { return this.resources[i]; }
        }
        return null;
    },
    
    processRequest: function(resource, req, res) {
        sys.puts('process request: method=' + req.method + ',resource=' + resource.constructor.name);
        switch(req.method) {
            case 'GET': resource.doGet(req, res); break;
            case 'POST': resource.doPost(req, res); break;
            case 'DELETE': resource.doDelete(req, res); break;
            case 'PUT': resource.doPut(req, res); break;
            default:
                sys.puts('unsupported method: ' + req.method);
                return false;
        }
        
        return true;
    },
});
