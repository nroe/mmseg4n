/**
 * 词典
 * 
 * @author Nroe
 * @package MMSeg4N.seg
 * @see mmseg4j.MaxWord
 */

var util	= require('util');
	fs      = require("fs"),
    path    = require("path");

require(ROOT_PATH + "/Io/FileLineReader.js");
require(ROOT_PATH + "/Seg/Dictionary/CharNode.js");

Seg_Dictionary = new JS.Class({
    include : JS.Console,
    charsFilename : "/chars.dic",
    unitsFilename : "/units.dic",
    
    dist : null,
    unit : null,
    
    lastLoadTime : -1,
    
    dicPath : null,
    
    startDicMemoryUsage : 0,
    endDicMemoryUsage : 0,
    startDicTimestamp : 0,
    endDicTimestamp : 0,
    
    initialize: function(path)
    {   
        this.dicPath = path;
        
        if (undefined == this.dicPath || null == this.dicPath) {
            this.dicPath = this.getDefalutPath();
        }
        
        LOGGER.info("start load dictionary in \"" + this.dicPath + "\"");
        this.reload();
    },
    
    reload: function()
    {
    	this.startDicMemoryUsage = process.memoryUsage();
        this.startDicTimestamp = Date.now();
        
        this.unit = this.loadUnit(this.dicPath);
        this.dist = this.loadDic(this.dicPath);
        
        this.lastLoadTime = this.endDicTimestamp = Date.now();
        this.endDicMemoryUsage = process.memoryUsage();
        LOGGER.debug("dictionary memory usage:"
        		+ ((this.endDicMemoryUsage.rss - this.startDicMemoryUsage.rss) / 1024 / 1024)
        		+ "(MB) elapsed time:" + ((this.endDicTimestamp - this.startDicTimestamp) / 1000) + "(SEC)");
    },
    
    getLastLoadTime: function()
    {
        return this.lastLoadTime;
    },
    
    /**
     * 加载词典
     * 
     * @param string dicPath 词典目录
     * @return JS.Hash key => unicode, value => Seg_Dictionary_CharNode
     */
    loadDic: function(dicPath)
    {
        var dic = new Object();
        
        if (!path.existsSync(dicPath)) {
        	LOGGER.warn("dictionary directory \"" + dicPath  + "\" not exists");
            return dic;
        }
        
        var charsDicFilename = dicPath + this.charsFilename,
            flr = new Io_FileLineReader(charsDicFilename);
        
        var line = null, part = null;
        /**
         * 逐行读取 chars.dic 词典以及词频
         */
        while (flr.hasNextLine()) {
            line = flr.nextLine();
            part = line.split(" ");
            
            var cn = new Seg_Dictionary_CharNode();
            switch (part.length) {
                case 2:
                    cn.setFreq((Math.log(parseInt(part[1]))*100));
                case 1:
                	dic[part[0].charCodeAt(0)] = cn;
            }
        }
        
        line = null, part = null, flr = null;
        
        LOGGER.info("load chars.dic \"" + charsDicFilename + "\" success.");
        
        /**
         * 加载 word 词典
         * 尝试加载 dicPath 目录下除 this.charsFilename 以及 this.unitsFilename 的所有 *.dic 文件
         * 如果包含子目录将递归加载
         */
        var
         	wordsCount = 0;
        	wordsLength = 0;
         	words = this.listWordsFiles(),
         	wordFilename = '',
         	charCode = -1,
         	wflr = null;
         
        for (var i = 0; i < words.length; i++) {
        	 wordFilename = words[i];
        	 switch (wordFilename) {
                 case (dicPath + this.charsFilename) : 
                 case (dicPath + this.unitsFilename) :
                    words.splice(i, 1);
                    break;
                    
                 default :
                     var
                     	wordTailChars = new Array(),
                     	wordTailCharCode = -1;
                     	wordTail = null;
                     	
                     /**
                      * 加载词典
                      */
                     wflr = new Io_FileLineReader(wordFilename);
                     while (wflr.hasNextLine()) {
                         line = wflr.nextLine(),
                         charCode = line.charCodeAt(0);
                         
                         if (line.length < 2) {
                             continue;
                         }
                        
                         if (35 == charCode) {
                             continue;
                         }

                         var cn = dic[charCode];                   
                         if (undefined == cn || null == cn) {
                             cn = new Seg_Dictionary_CharNode();
                             dic[charCode] = cn;
                         }
                         
                         wordTailChars.length = 0,
                         wordTailCharCode = -1;
                         wordTail = line.substr(1, line.length -1);
                         
                         for (var i=0; i< wordTail.length; i++) {
                        	 wordTailCharCode = wordTail[i].charCodeAt(0);
                        	 wordTailChars.push(wordTailCharCode);
                         }
                         
                         cn.addWordTail(wordTailChars);
                         wordTail = null, wordTailCharCode = -1;
                         wordsCount++;
                         wordsLength += line.length;
                     }
                    
                     LOGGER.info("load \"" + wordFilename + "\" success.");
        	 }
        }
        
        LOGGER.info("loaded dictionary success. word count:" + wordsCount + " word length:" + wordsLength);
        words = null;
        return dic;
    },
    
    /**
     * 加载单位词典
     * 
     * @param string dicPath 词典目录
     * @return JS.Hash
     */
    loadUnit: function(dicPath)
    {
    	var dic = new Object();
        
        if (!path.existsSync(dicPath)) {
        	LOGGER.warn("dictionary directory \"" + dicPath  + "\" not exists");
            return dic;
        }
        
        var unitsDicFilename = dicPath + this.unitsFilename,
            flr = new Io_FileLineReader(unitsDicFilename);
        
        /**
         * 逐行读取 units.dic 词典以及词频
         */
        while (flr.hasNextLine()) {
            var line= flr.nextLine();
                c   = line.charCodeAt(0);
            
            if (35 == c) {
                continue;
            }
            
            dic[c] = true;
        }
        
        LOGGER.info("load units.dic \"" + unitsDicFilename + "\" success.");
        return dic;
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
            return node.maxMatchNodeLengthList(tailLens, sen, offset+1);
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
            LOGGER.info("look up in default dictionary directory path:\"" + Seg_Dictionary.defalutPath + "\"");
            
            if (!path.existsSync(Seg_Dictionary.defalutPath)) {
                LOGGER.warn("default path:\"" + Seg_Dictionary.defalutPath + "\" is not exist.");
            }
        }
        
        return Seg_Dictionary.defalutPath;
    },
    
    /**
     * @return array 返回词典完整路径列表
    */
    listWordsFiles: function(path)
    {
        if (undefined == path || null == path) {
            path = this.dicPath;
        }
        
        var
            files = fs.readdirSync(path),
            wordsFiles = new Array();
        
        if (files instanceof Array) {
            var filename = '';
            for(var i = 0; i < files.length; i++) {
                filename = path + "/" + files[i];
                
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
