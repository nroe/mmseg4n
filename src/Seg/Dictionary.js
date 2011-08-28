/**
 * 词典
 * 
 * @author Nroe
 * @package MMSeg4N.seg
 * @see mmseg4j.MaxWord
 */
 
var fs      = require("fs"),
    path    = require("path"),
    util    = require("util");

require(ROOT_PATH + "/Io/FileLineReader.js");
require(ROOT_PATH + "/Seg/Dictionary/CharNode.js");

Seg_Dictionary = new JS.Class({
    include: JS.Console,
    
    initialize: function(path)
    {
        this.charsFilename = '/chars.dic';
        this.unitsFilename = '/units.dic';
        this.dist = null;
        this.unit = null;
        
        this.wordsLastTime = new JS.Hash([]);
        this.lastLoadTime = -1;
        
        this.dicPath = path;
        
        if (undefined == this.dicPath) {
            this.dicPath = this.getDefalutPath();
        }
        
        util.log("start load dictionary in \"" + this.dicPath + "\""); 
        this.reload();
    },
    
    reload: function()
    {
        this.wordsLastTime.clear();
        this.lastLoadTime = new Date().getTime();
        this.dist = this.loadDic(this.dicPath);
        this.unit = this.loadUnit(this.dicPath);
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
        var dic = new JS.Hash([]);
        
        if (!path.existsSync(dicPath)) {
            return dic;
        }
        
        var wordsLastTime = this.wordsLastTime,
            charsDicFilename = dicPath + this.charsFilename,
            flr = new Io_FileLineReader(charsDicFilename);
        
        /**
         * 逐行读取 chars.dic 词典以及词频
         */
        while (flr.hasNextLine()) {
            var line = flr.nextLine();
            part = line.split(" ");
            
            var cn = new Seg_Dictionary_CharNode();
            switch (part.length) {
                case 2:
                    cn.setFreq((Math.log(parseInt(part[1]))*100));
                case 1:
                    dic.put(part[0].charCodeAt(0), cn);
            }
        }
        
        util.log("load dic:\"" + charsDicFilename + "\" success.");
        fs.lstat(charsDicFilename, function(err, stats) {
            wordsLastTime.put(charsDicFilename, stats.mtime);
            util.log("fetch dic:\"" + charsDicFilename +"\" info ok. ctime:" + stats.ctime + " mtime:" + stats.mtime);
        });
        
        /**
         * 加载 word 词典
         * 尝试加载 dicPath 目录下除 this.charsFilename 以及 this.unitsFilename 的所有 *.dic 文件
         * 如果包含子目录将递归加载
         */
         var words = this.listWordsFiles();
         for (var i = 0; i < words.length; i++) {
             var wordFilename = words[i];
             switch (wordFilename) {
                 case (dicPath + this.charsFilename) : 
                 case (dicPath + this.unitsFilename) :
                    words.splice(i, 1);
                    break;
                    
                default :
                    /**
                     * 加载词典
                     */
                    var wflr = new Io_FileLineReader(wordFilename);
                    while (wflr.hasNextLine()) {
                        var line    = wflr.nextLine(),
                            c       = line.charCodeAt(0);
                        
                        if (line.length < 2) {
                            continue;
                        }
                        
                        if (35 == c) {
                            continue;
                        }
                        
                        var cn = dic.get(c);
                        if (null == cn) {
                            cn = new Seg_Dictionary_CharNode();
                            dic.put(c, cn);
                        }
                        
                        var wordTailChar = new Array(),
                            wordTail = line.substr(1, line.length -1);
                        for (var i=0; i< wordTail.length; i++) {
                            wordTailChar.push(wordTail[i].charCodeAt(0));
                        }
                        cn.addWordTail(wordTailChar);
                    }
                    
                    util.log("load dic:\"" + wordFilename + "\" success.");
                    fs.lstat(wordFilename, function(err, stats) {
                        wordsLastTime.put(wordFilename, stats.mtime);
                        util.log("fetch dic:\"" + wordFilename +"\" info ok. ctime:" + stats.ctime + " mtime:" + stats.mtime);
                    });
             }
         }
         
         this.dist = dic;
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
        var dic = new JS.Hash([]);
        
        if (!path.existsSync(dicPath)) {
            return dic;
        }
        
        var wordsLastTime = this.wordsLastTime,
            unitsDicFilename = dicPath + this.unitsFilename,
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
            
            dic.put(c, true);
        }
        
        util.log("load dic:\"" + unitsDicFilename + "\" success.");
        fs.lstat(unitsDicFilename, function(err, stats) {
            wordsLastTime.put(unitsDicFilename, stats.mtime);
            util.log("fetch dic:\"" + unitsDicFilename +"\" info ok. ctime:" + stats.ctime + " mtime:" + stats.mtime);
        });
        
        return dic;
    },
    
    /**
     * @param integer codePoint
     * @return boolean
     */
    isUnit: function(codePoint)
    {
        return this.unit.hasKey(codePoint);
    },
    
    /**
     * @param char unicode
     * @return Seg_Dictionary_CharNode
     */
    get: function(ch)
    {
        return this.dist.get(ch);
    },
    
    /**
     * @return boolean
     */
    match: function(word)
    {
        if (null == word || word.length < 2) {
            return false;
        }
        
        var cn = this.dist.get(word.charCodeAt(0));
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
     * @return JS.Hash
     */
    getWordsLastTime: function()
    {
        return this.wordsLastTime;
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

        var node = this.dist.get(sen[offset]);
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
            Seg_Dictionary.defalutPath = path.dirname(__filename) + '/data';
            util.log("look up in default dictionary directory path:\"" + Seg_Dictionary.defalutPath + "\"");
            
            if (!path.existsSync(Seg_Dictionary.defalutPath)) {
                util.debug("warning: default path:\"" + Seg_Dictionary.defalutPath + "\" is not exist.");
            }
        }
        
        return Seg_Dictionary.defalutPath;
    },
    
    /**
     * @return array 返回词典完整路径列表
    */
    listWordsFiles: function(path)
    {
        if (undefined == path) {
            path = this.dicPath;
        }
        
        var files = fs.readdirSync(path),
        wordsFiles = new Array();
        
        if (files instanceof Array) {
            for(var i = 0; i < files.length; i++) {
                var filename = path + "/" + files[i],
                    ext = filename.split('.').pop();
               
                if (ext == 'dic') {
                    wordsFiles.push(filename);
                } else {
                    var isDir = fs.statSync(filename).isDirectory();
                    if (isDir) {
                        var wf = this.listWordsFiles(filename);
                        wordsFiles = wordsFiles.concat(wf);
                    }
                }
            }
        }
        
        return wordsFiles.sort();
    }
});

/**
 * 默认词典路径
 * 
 * @var string
 */
Seg_Dictionary.defalutPath = null;
