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
    dic : null,
    dicLoaded : false,
    
    reqUrl : null,
    text : null,
    words : new Array(),
    startSegMemoryUsage : 0,
    endSegMemoryUsage : 0,
    message : {
        REQ_ERR_UNKNOWN : { code:1, msg:"unknown_error"},
        REQ_SUCCESS : { code:0, msg:"success" },
        REQ_SEG_DICTIONARY_LOADING : { code:11, msg:"dictionary_is_loading" },
    },
    
    initialize: function(dicDir)
    {
        this.dic = new Seg_Dictionary(dicDir)
        this.analyzer = new Analysis_Analyzer_MMSeg_Complex(this.dic);
        var self = this;
        
        var interval = setInterval(function() {
            if (self.dic.isDicLoaded()) {
                self.dicLoaded = true;
                clearInterval(this);
            }
        },1000);
    },
    
    doGet: function(req, res)
    {
        var result = { code:this.message.REQ_ERR_UNKNOWN.code, data: new Array(), msg:this.message.REQ_ERR_UNKNOWN.msg };
        
        if (this.dicLoaded) {
            this.startSegMemoryUsage = process.memoryUsage();
            this.reqUrl = url.parse(req.url, true);
            this.text = (this.reqUrl.query) ? this.reqUrl.query['text'] : null;
            
            this.words.length = 0;
            var mmseg = new Seg(this.text, this.analyzer);
            
            try {
                while ( (word = mmseg.next()) != null ) {
                    this.words.push(word.getTermText());
                }
                result = { code:this.message.REQ_SUCCESS.code, data: new Array(), msg:this.message.REQ_SUCCESS.msg };
                result["data"] = this.words;
                mmseg = null;
            } catch (Exception) {
                
            }
            
            this.endSegMemoryUsage = process.memoryUsage();
            LOGGER.info("analyze complex require memory:"
                    + ((this.endSegMemoryUsage.rss - this.startSegMemoryUsage.rss) / 1024) + "(KB)"
                    + " total usage:" + (this.endSegMemoryUsage.rss / 1024 / 1024) + "(MB)");
        } else {
            result = { code:this.message.REQ_SEG_DICTIONARY_LOADING.code, data: new Array(), msg:this.message.REQ_SEG_DICTIONARY_LOADING.msg };
        }
        
        res.writeHead(200, {'Content-Type': 'text/plain'} );
        res.write(JSON.stringify(result));
        res.end();
    },
});