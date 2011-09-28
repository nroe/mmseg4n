/**
 * 词典
 * 
 * @author Nroe
 * @package MMSeg4N.seg
 * @see mmseg4j.MaxWord
 */

var util	= require('util'),
	fs      = require("fs"),
    path    = require("path"),
    hash    = require(ROOT_PATH + "/lib/hash.js");

require(ROOT_PATH + "/Seg/Dictionary/CharNode.js");

Seg_Dictionary = new JS.Class({
    charsFilename : "/chars.dic",
    unitsFilename : "/units.dic",
    
    dist : new Object(),
    unit : new Object(),
    loadUnitDone : false,
    loadDistCharsDone : false,
    loadDistWordsDone : false,
    
    /**
     * @var distWordsCount 统计加载词个数
     * @var distWordsLength 统计加载词总长度
     */
    distWordsCount : 0,
    distWordsLength : 0,
    
    /**
     * @var lastLoadTime 最后一次加载时间
     */
    lastLoadTime : -1,
    
    /**
     * @var dicPath 加载词典路径
     */
    dicPath : null,
    
    /**
     * @var dicReadBufferSize 加载词典缓冲大小
     * @see fs.createReadStream
     */
    dicReadBufferSize : 100,
    
    wordBuffer : new Object(),
    wordLineEnd : new Object(),
    wordLine : new Object(),
    
    initialize: function(path)
    {   
        this.dicPath = path;
        
        if (undefined == this.dicPath || null == this.dicPath) {
            this.dicPath = this.getDefalutPath();
        }
        
        LOGGER.info("start to load dictionary in \"" + this.dicPath + "\"");
        this.reload();
    },
    
    getDist: function() { return this.dist; },
    getDistInfo: function() { return { count:this.distWordsCount, length:this.distWordsLength, lastLoadTime:this.lastLoadTime }; },
    
    /**
     * 重新载入字典
     * 
     * @return void
     */
    reload: function()
    {
        this.loadUnitDone = false;
        this.loadDistCharsDone = false;
        this.loadDistWordsDone = false;
        
        try {
            this.loadUnit(this.dicPath);
            this.loadDic(this.dicPath);
            
            this.lastLoadTime = Date.now();
        } catch (e) {
            LOGGER.warn("dictionary load failed.");
        }
    },
    
    /**
     * 判断所有字典是否全部加载完毕
     * 注意：由于字典加载是异步的，所以应该先判断字典是否全部加载，再进行分词
     * 
     * @return boolean
     */
    isDicLoaded: function()
    {
        if ( this.loadUnitDone && this.loadDistCharsDone && this.loadDistWordsDone) {
            return true;
        }
        
        return false;
    },
    
    getLastLoadTime: function()
    {
        return this.lastLoadTime;
    },
    
    _loadUnitsDic: function(string, dic)
    {
        c = string.charCodeAt(0);
        if (35 == c) {
            return;
        }
        
        dic[c] = true;
    },
    
    _loadCharsDic: function(string, dic)
    {
        var charCode = string.charCodeAt(0);
        if (35 == charCode) {
            return;
        }
        
        var part = string.split(" ");
        var cn = dic[charCode];
        if (undefined == cn || null == cn) {
            var cn = new Seg_Dictionary_CharNode();   
        }
        
        switch (part.length) {
            case 2:
                cn.setFreq((Math.log(parseInt(part[1]))*100));
            case 1:
                dic[charCode] = cn;
        }
        
        part = null;
    },
    
    _loadWordDic: function(string, dic)
    {
        if (string.length < 2) {
            return;
        }
        
        var charCode = string.charCodeAt(0);
        if (35 == charCode) {
            return;
        }
        
        var cn = dic[charCode];                   
        if (undefined == cn || null == cn) {
            cn = new Seg_Dictionary_CharNode();
            dic[charCode] = cn;
        }
        
        var wordTailChars = new Array();
        var wordTail = string.substr(1, string.length -1);
        
        for (var l=0; l<wordTail.length; l++) {
            wordTailChars.push(wordTail.charCodeAt(l));
        }
        
        cn.addWordTail(wordTailChars);
        wordTail = null;
        

        this.distWordsCount ++;
        this.distWordsLength += string.length;
    },
    
    /**
     * 加载词典
     * 
     * @param string dicPath 词典目录
     * @return void
     */
    loadDic: function(dicPath)
    {
        dicPath = path.normalize(dicPath);
        if (!path.existsSync(dicPath)) {
        	LOGGER.warn("dictionary's directory \"" + dicPath  + "\" does not exist.");
            return;
        }
        
        /**
         * @var dic Object key => unicode, value => Seg_Dictionary_CharNode
         */
        var dic = new Object(), self = this;
        var charsDicFilename = dicPath + this.charsFilename;
        var charsStream = fs.createReadStream(charsDicFilename, {
            "flags": "r",
            "encoding": "utf8",
            "mode": 0666,
            "bufferSize": this.dicReadBufferSize});
        var charsBuffer = "",
            lineEnd = -1, line = "";

        charsStream.addListener("data", function(chunk) {
            charsBuffer += chunk;
            
            do {
                lineEnd = charsBuffer.indexOf("\n");
                if (lineEnd > -1) {
                    line = charsBuffer.substring(0, lineEnd);
                    charsBuffer = charsBuffer.substring(lineEnd + 1, charsBuffer.length);
                    
                    self._loadCharsDic(line, dic);
                }
            } while(lineEnd > -1);
        });
        charsStream.addListener("end", function() {
            if (charsBuffer.length > 0){
                self._loadCharsDic(charsBuffer, dic);
            }
            
            self.dist = dic;
            self.loadDistCharsDone = true;
            LOGGER.info("load [chars.dic] \"" + charsDicFilename + "\" successfully.");
        });
        
        /**
         * 加载 word 词典
         * 尝试加载 dicPath 目录下除 this.charsFilename 以及 this.unitsFilename 的所有 *.dic 文件
         * 如果包含子目录将递归加载
         */
        var
         	wordsCount = 0,
        	wordsLength = 0,
        	wordsFileCount = 0,
         	words = this.listWordsFiles(),
         	wordStream = {};
        
        for (var i=0; i<words.length; i++) {
        	 var wordFilename = words[i];
        	 
        	 switch (wordFilename) {
                 case (dicPath + this.charsFilename) : 
                 case (dicPath + this.unitsFilename) :
                    words.splice(i, 1);
                    break;
                 default :
                     LOGGER.info("start to load word \"" + wordFilename + "\" ...");
                     
                     var wordHashID = hash.MD5.hexdigest(wordFilename);
                     wordsFileCount ++;
                     
                     /**
                      * 加载词典
                      */
                     var wordStream = fs.createReadStream(wordFilename, {
                         "flags" : "r",
                         "encoding" : "utf8",
                         "mode" : 0666,
                         "bufferSize" : this.dicReadBufferSize,
                         "wordHashID" : wordHashID,
                     });
                     
                     this.wordBuffer[wordHashID] = "";
                     this.wordLineEnd[wordHashID] = -1;
                     this.wordLine[wordHashID] = "";
                     
                     wordStream.addListener("data", function(chunk) {
                         var wordHashID = this.wordHashID;
                         self.wordBuffer[wordHashID] += chunk;
                         
                         do {
                             self.wordLineEnd[wordHashID] = self.wordBuffer[wordHashID].indexOf("\n");
                             if (self.wordLineEnd[wordHashID] > -1) {
                                 self.wordLine[wordHashID] = self.wordBuffer[wordHashID].substring(0, self.wordLineEnd[wordHashID]);
                                 self.wordBuffer[wordHashID] = self.wordBuffer[wordHashID].substring(self.wordLineEnd[wordHashID] + 1,  self.wordBuffer[wordHashID].length);
                                 
                                 self._loadWordDic(self.wordLine[wordHashID], dic);
                             }
                         } while(self.wordLineEnd[wordHashID] > -1);
                     });
                     wordStream.addListener("end", function() {
                         var wordHashID = this.wordHashID;
                         if (self.wordBuffer[wordHashID].length > 0) {
                             self._loadWordDic(self.wordBuffer[wordHashID], dic);
                         }
                         
                         self.dist = dic;
                         
                         if ((wordsFileCount --) && wordsFileCount == 0) {
                             self.loadDistWordsDone = true;
                         }
                         
                         self.wordBuffer[wordHashID] = "";
                         self.wordLineEnd[wordHashID] = -1;
                         self.wordLine[wordHashID] = "";
                     });
        	 }
        }
        
        words = null;
    },
    
    /**
     * 加载单位词典
     * 逐行读取 units.dic 词典以及词频
     * 
     * @param string dicPath 词典目录
     * @return void
     */
    loadUnit: function(dicPath)
    {
        dicPath = path.normalize(dicPath);
        if (!path.existsSync(dicPath)) {
        	LOGGER.warn("dictionary's directory \"" + dicPath  + "\" does not exist");
            return;
        }
        
        var dic = new Object();
        var unitsDicFilename = dicPath + this.unitsFilename;
        var unitsStream = fs.createReadStream(unitsDicFilename, {
            "flags": "r",
            "encoding": "utf8",
            "mode": 0666,
            "bufferSize": this.dicReadBufferSize});
        var unitsBuffer = "",
            lineEnd = -1, line = "",
            self = this;

        unitsStream.addListener("data", function(chunk) {
            unitsBuffer += chunk;
            
            do {
                lineEnd = unitsBuffer.indexOf("\n");
                if (lineEnd > -1) {
                    line = unitsBuffer.substring(0, lineEnd);
                    unitsBuffer = unitsBuffer.substring(lineEnd + 1, unitsBuffer.length);
                    
                    self._loadUnitsDic(line, dic);
                }
            } while(lineEnd > -1);
        });
        unitsStream.addListener("end", function() {
            if (unitsBuffer.length > 0) {
                self._loadUnitsDic(unitsBuffer, dic);
            }
            
            self.unit = dic;
            self.loadUnitDone = true;
            LOGGER.info("load [units.dic] \"" + unitsDicFilename + "\" successfully.");
        });
    },
    
    /**
     * @param integer codePoint
     * @return boolean
     */
    isUnit: function(codePoint)
    {
    	return (undefined != this.unit[codePoint]);
    },
    
    /**
     * @param char unicode
     * @return Seg_Dictionary_CharNode
     */
    get: function(ch)
    {
    	return this.dist[ch];
    },
    
    /**
     * @return boolean
     */
    match: function(word)
    {
        if (null == word || word.length < 2) {
            return false;
        }
        
        var cn = this.dist[word.charCodeAt(0)];
        return (this.search(cn, word, 0, word.length -1) >= 0);
    },
    
    /**
     * @param Seg_Dictionary_CharNode node
     * @param string sen
     * @param integer offset
     * @param integer tailLen
     * @return integer
     */
    search: function(node, sen, offset, tailLen)
    {
        if (null != node) {
            return node.indexOf(sen, offset, tailLen);
        }
        
        return -1;
    },
    
    /**
     * @param Seg_Dictionary_CharNode node
     * @param Array tailLens
     * @param String sen
     * @param Integer offset
     * @return Array
     */
    maxMatchNodeLengthList: function(node, tailLens, sen, offset)
    {
        tailLens.length = 0;
        tailLens.push(0);
        
        if (null != node) {
            var test = node.maxMatchNodeLengthList(tailLens, sen, offset+1);
//            LOGGER.debug(" >maxMatchNodeLengthList:" + tailLens + " node:" + node + " offset:" + offset);
            return test;
        }
        
        return tailLens;
    },
    
    /**
     * @return integer
     * @see Seg_Dictionary::maxMatchNodeLengthByNode
     */
    maxMatchNodeLength: function(sen, offset)
    {
    	var node = this.dist[sen[offset]];
        return this.maxMatchNodeLengthByNode(node, sen, offset);
    },
    
    /**
     * @param Seg_Dictionary_CharNode node
     * @param Array sen 匹配句子的 unicode
     * @param 
     * @return integer
     */
    maxMatchNodeLengthByNode: function (node, sen, offset)
    {
        if (null != node) {
            return node.maxMatchNodeLength(sen, offset + 1);
        }
        
        return 0;
    },
    
    /**
     * 获取默认词典目录路径
     * 
     * @return string
     */
    getDefalutPath: function ()
    {
        if (Seg_Dictionary.defalutPath === null) {
            Seg_Dictionary.defalutPath = __dirname + '/data';
            LOGGER.info("find in the default dictionary directory \"" + Seg_Dictionary.defalutPath + "\"");
            
            if (!path.existsSync(Seg_Dictionary.defalutPath)) {
                LOGGER.warn("the default dictionary  directory \"" + Seg_Dictionary.defalutPath + "\" does not exist.");
            }
        }
        
        return Seg_Dictionary.defalutPath;
    },
    
    /**
     * @return array 返回词典完整路径列表
    */
    listWordsFiles: function(fp)
    {
        if (undefined == fp || null == fp) {
            fp = this.dicPath;
        }
        
        var
            files = fs.readdirSync(fp),
            wordsFiles = new Array();
        
        if (files instanceof Array) {
            var filename = '';
            for(var i=0; i<files.length; i++) {
                filename = fp + "/" + files[i];
                filename = path.normalize(filename);
                
                if (filename.split('.').pop() == 'dic') {
                    wordsFiles.push(filename);
                } else {
                    if (fs.statSync(filename).isDirectory()) {
                        wordsFiles = wordsFiles.concat(this.listWordsFiles(filename));
                    }
                }
            }
        }
        
        files = null;
        return wordsFiles.sort();
    }
});

/**
 * 默认词典路径
 * 
 * @var string
 */
Seg_Dictionary.defalutPath = null;
