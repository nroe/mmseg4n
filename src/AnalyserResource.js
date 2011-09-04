/**
 * @author Nroe
 */
 
var url = require('url');
var util = require('util');

require(ROOT_PATH + "/Seg.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/Complex.js");
require(ROOT_PATH + "/Seg/Dictionary.js");
require(ROOT_PATH + "/lib/JSON-js/json2.js");

AnalyserResource = new JS.Class({
    path : /\/analyze/,
    
    analyzer : null,
    
    reqUrl : null,
    text : null,
    words : new Array(),
    startSegMemoryUsage : 0,
    endSegMemoryUsage : 0,
    
    initialize: function(dicDir)
    {
        this.analyzer = new Analysis_Analyzer_MMSeg_Complex(new Seg_Dictionary(dicDir));
    },
    
    doGet: function(req, res)
    {
    	this.startSegMemoryUsage = process.memoryUsage();
        this.reqUrl = url.parse(req.url, true);
        this.text = (this.reqUrl.query) ? this.reqUrl.query['text'] : null;
        
        this.words.length = 0;
        var mmseg = new Seg(this.text, this.analyzer),
            result = { "code": 0, "data": new Array(), "msg":"" };
        
        try {
            while ( (word = mmseg.next()) != null ) {
                this.words.push(word.getTermText());
            }
            result["data"] = this.words;
        } catch (Exception) {
            
        }
        
        this.endSegMemoryUsage = process.memoryUsage();
        LOGGER.info("analyze complex memory usage:"
        		+ ((this.endSegMemoryUsage.rss - this.startSegMemoryUsage.rss) / 1024) + "(KB)"
        		+ " total usage:" + (this.endSegMemoryUsage.rss / 1024 / 1024) + "(MB)");
        
        res.writeHead(200, {'Content-Type': 'text/plain'} );
        res.write(JSON.stringify(result));
        res.end();
        
        mmseg = null;
    },
});