/**
 * @author Nroe
 */
 
var url = require('url');
var util = require('util');

require(ROOT_PATH + "/Seg.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMseg/Complex.js");
require(ROOT_PATH + "/Seg/Dictionary.js");
require(ROOT_PATH + "/lib/JSON-JS/json2.js");

AnalyserResource = new JS.Class({
    path: /\/analyser/,
    
    tasks: ['first task', 'second task', 'third task'],

    initialize: function(dicDir) {
        var dic = new Seg_Dictionary(dicDir);
        this.complex = new Analysis_Analyzer_MMSeg_Complex(dic);
    },
    
    doGet: function(req, res) {
        var reqUrl = url.parse(req.url, true);
        var text = (reqUrl.query) ? reqUrl.query['text'] : null;
        
        var mmseg = new Seg(text, this.complex),
            result = { "code": 0, "data": new Array(), "msg":"" };
            words = new Array();
        
        
        try {
            while ( (word = mmseg.next()) != null ) {
                words.push(word.getTermText());
            }
            result["data"] = words;
        } catch (Exception) {
            
        }

        console.log(util.inspect(process.memoryUsage()));
        res.writeHead(200, {'Content-Type': 'text/plain'} );
        res.write(JSON.stringify(result));
        res.end();
        
        reqUrl = null;
        text = null;
        mmseg = null;
        words = null;
    },
});