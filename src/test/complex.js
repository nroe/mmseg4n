/**
 * Complex 分词测试
 */
exports.complex = {
    /**
     * 初始化分词算法
     */
    'init complex' : function(test) {
        ROOT_PATH = __dirname + '/../';
        JSCLASS_PATH = ROOT_PATH + '/lib/JS.Class/src';
        
        require(JSCLASS_PATH + "/loader");
        
        JS.require('JS.Console');
        JS.require('JS.Class');
        JS.require('JS.Hash');
        
        /**
         * LOG4JS 和 NODEUNIT 有冲突将导致 UNIT 无法正常输出
         */
        LOGGER = {
                trace : function() {},
                debug : function(msg) { console.log("    DEBUG>" + msg); },
                info : function(msg) { console.log("    INFO>" + msg); },
                warn : function() {},
                error : function() {},
                fatal : function() {},
        };
        
        require(ROOT_PATH + "/Seg.js");
        require(ROOT_PATH + "/Seg/Dictionary.js");
        require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/Complex.js");
        require(ROOT_PATH + "/Io/FileLineReader.js");
        
        /**
         * 将 /data 目录作为词典目录
         */
        this.dic = new Seg_Dictionary(__dirname + '/../../data');
        this.complex = new Analysis_Analyzer_MMSeg_Complex(this.dic);
        var self = this;
        
        this.segComplex = function (text) {
            var mmseg = new Seg(text, self.complex),
                words = new Array();
            
            while ((word = mmseg.next()) != null) {
                words.push(word.getTermText());
            }
            
            return words.join(" | ");
        };
        
        var interval = setInterval(function() {
            if (self.dic.isDicLoaded()) {
                clearInterval(this);
                test.done();
            } else {
                LOGGER.debug("dictionary is loading...");
            }
        }, 1000);
    },
    
    /**
     * 与 MMSEG4J 切出的词进行比较
     * 参考： /asset/people-daily.mmseg4j.complex.txt
     */
    'people-daily complex' : function(test) {
        var textPath = __dirname + '/../../asset/people-daily.txt',
            segTextPath = __dirname + '/../../asset/people-daily.mmseg4j.complex.txt',
            segText = '';
        
        var fs = require('fs');
        var util = require('util');

        var text = fs.readFileSync(textPath, "utf8").toString().split("\n"),
            segText = fs.readFileSync(segTextPath, "utf8").toString().split("\n"),
            textLine = "",
            segTextLine = "",
            complexSegTextLine = "";
        
        var stdoutCount = 0;
        process.stdout.write("    ");
        
        do {
            textLine = text.shift();
            segTextLine = segText.shift();
            
            if (textLine && segTextLine) {
                stdoutCount ++;
                if (stdoutCount % 1000 == 1) { process.stdout.write( stdoutCount + ""); }
                if (stdoutCount % 100 == 1) { process.stdout.write("."); }
                
                complexSegTextLine = this.segComplex(textLine);
                test.equal(complexSegTextLine, segTextLine);
            }
        } while(undefined != textLine && undefined != segTextLine);
        
        console.log("");
        LOGGER.info("compare " + stdoutCount + " item"); 
        
        test.done();
    },
}
