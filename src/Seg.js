/**
 * 
 * @author Nroe
 * @package MMSeg4N
 * @see com.chenlb.mmseg4j.MMSeg
 */
 
require(ROOT_PATH + "/Lang/Character.js");
require(ROOT_PATH + "/Analysis/Token.js");
require(ROOT_PATH + "/Seg/ReadChar.js");

Seg = new JS.Class({
    include: JS.Console,
    
    initialize: function(input, analyzer) {
        this.analyzer = analyzer;
        this.input = input;
        this.inputLength = input.length;
        
        this.reset();
    },
    
    /**
     * 读取文本中下一字符
     * 
     * @return integer
     */
    readNext: function() {
        var unicode = -1;
            c = this.input.charAt(this.position);
        
        if ('' != c) {
            unicode = c.toLowerCase().charCodeAt(0);
            this.position++;
        }
        
        return unicode;
    },
    
    /**
     * 扫描文本指针回退
     * 
     * @return void
     */
    pushBack: function()
    {
        this.position --;
    },
    
    reset: function()
    {
        this.bufWord = new Array(); /* Token 储存队列，从头位置开始取 */
        this.position = 0; /* 扫描字符串当前位置*/
        
        this.currentSentence = null;
        
        /**
         * empty bufSentence
         */
        this.bufSentence = new Array();
    },
    
    next: function() {
        var word = this.bufWord.shift();
        
        if (null == word) {
    
            this.bufSentence.length = 0;
            
            var data = -1,
                read = true;
            
            while(read && (data = this.readNext()) != -1) {
                /**
                 * 默认一次可以读出同一类字符,就可以分词内容
                 */
                read = false;
                var type = Lang_Character.prototype.getType(data),
                    wordType = Analysis_Token.TYPE_WORD;
                
                switch(type) {
                    case Lang_Character.UPPERCASE_LETTER:
                    case Lang_Character.LOWERCASE_LETTER:
                    case Lang_Character.TITLECASE_LETTER:
                    case Lang_Character.MODIFIER_LETTER:
                        /*
                         * 1. 0x410-0x44f -> А-я    //俄文
                         * 2. 0x391-0x3a9 -> Α-Ω    //希腊大写
                         * 3. 0x3b1-0x3c9 -> α-ω    //希腊小写
                         */
                        data = Seg_ReadChar.prototype.toAscii(data);
                        var nl = Seg_ReadChar.prototype.getNation(data);
                        if(nl == Seg_ReadChar.NationLetter.UNKNOW) {
                            read = true;
                            break;
                        }
                        wordType = Analysis_Token.TYPE_LETTER;
                        this.bufSentence.push(data);
                        switch(nl) {
                            case 'EN':
                                //字母后面的数字,如: VH049PA
                                var rcad = new Seg_ReadCharByAsciiOrDigit();
                                this.readChars(rcad);
                                if (rcad.hasDigit()) {
                                    wordType = Analysis_Token.TYPE_LETTER_OR_DIGIT;
                                }
                                break;
                            case 'RA':
                                readChars(new Seg_ReadCharByRussia());
                                break;
                            case 'GE':
                                readChars(new Seg_ReadCharByGreece());
                                break;
                        }
                        
                        this.bufWord.push(
                            new Analysis_Token(
                                this.toChars(this.bufSentence),
                                this.position - this.bufSentence.length + 1,
                                wordType));
                        this.bufSentence.length = 0;
                        break;
                    case Lang_Character.OTHER_LETTER:
                        /*
                         * 1. 0x3041-0x30f6 -> ぁ-ヶ  //日文(平|片)假名
                         * 2. 0x3105-0x3129 -> ㄅ-ㄩ  //注意符号
                         */
                        this.bufSentence.push(data);
                        var readc = this.readChars(new Seg_ReadCharByType(Lang_Character.OTHER_LETTER));
    
                        this.currentSentence = new Analysis_Sentence(
                            this.toChars(this.bufSentence),
                            this.position - this.bufSentence.length + 1);
                        
                        this.bufSentence.length = 0;
                        break;
                    /**
                     * 读取数字字符
                     */
                    case Lang_Character.DECIMAL_DIGIT_NUMBER:
                        this.bufSentence.push(Seg_ReadChar.prototype.toAscii(data));
                        this.readChars(new Seg_ReadCharDigit());
                        
                        wordType = Analysis_Token.TYPE_DIGIT;
                        var d = this.readNext();
                        if (d > -1) {
                            /**
                             * 数字 + 单位
                             * @see /data/units.dic
                             */
                            if (this.analyzer.isUnit(d)) {
                                /**
                                 * 加入数字部分字符
                                 */
                                this.bufWord.push(
                                    new Analysis_Token(
                                        this.toChars(this.bufSentence),
                                        this.position - this.bufSentence.length,
                                        Analysis_Token.TYPE_DIGIT));
                                
                                this.bufSentence.length = 0;
                                
                                /**
                                 * 加入单位部分字符
                                 */
                                this.bufSentence.push(d);
                                wordType = Analysis_Token.TYPE_WORD;
                            }
                            /**
                             * 数字 + 字母 + 数字
                             */
                            else {
                                this.pushBack();
                                if ( this.readChars(new Seg_ReadCharByAsciiOrDigit()) > 0) {  //如果有字母或数字都会连在一起.
                                    wordType = Analysis_Token.TYPE_DIGIT_OR_LETTER;
                                }
                            }
                        }
                        
                        this.bufWord.push(
                            new Analysis_Token(
                                this.toChars(this.bufSentence),
                                this.position - this.bufSentence.length + 1,
                                wordType));
                        
                        this.bufSentence.length = 0;
                        break;
                    case Lang_Character.LETTER_NUMBER:
                        // Ⅰ Ⅱ Ⅲ 单分
                        this.bufSentence.push(data);
                        this.readChars(new Seg_ReadCharByType(Lang_Character.LETTER_NUMBER));
                        
                        var startIdx = this.position - this.bufSentence.length + 1;
                        for(var i=0; i< this.bufSentence.length; i++) {
                            this.bufWord.push(
                                new Analysis_Token(
                                    this.bufSentence[i],
                                    startIdx ++,
                                    Analysis_Token.TYPE_LETTER_NUMBER));
                        }
                        
                        this.bufSentence.length = 0;
                        break;
                    case Lang_Character.OTHER_NUMBER:
                        //①⑩㈠㈩⒈⒑⒒⒛⑴⑽⑾⒇ 连着用
                        this.bufSentence.push(data);
                        this.readChars(new Seg_ReadCharByType(Lang_Character.OTHER_NUMBER));
                        
                        this.bufWord.push(
                            new Analysis_Token(
                                this.toChars(this.bufSentence),
                                this.position - this.bufSentence.length + 1,
                                Analysis_Token.TYPE_OTHER_NUMBER));
                                
                        this.bufSentence.length = 0;
                        break;
                    /**
                     * 其他字符
                     */
                    default :
                        read = true;
                }
            }
            
            /**
             * 中文句子部分进行分词
             * 
             * @see Analysis.Analyzer.js
             */
            if (this.currentSentence != null) {
                do {
                    var chunk = this.analyzer.seg(this.currentSentence);
                    if (null != chunk) {
                        tokens = chunk.getTokens();
                        var tmp = this.bufWord.concat(chunk.getTokens());
                        this.bufWord = tmp;
                    }
                } while (! this.currentSentence.isSegFinish());
                
                this.currentSentence = null;
            }
            
            word = this.bufWord.shift();
        }
        
        return word;
    },
    
    /**
     * @param array bufSentence
     * @return Array
     */
    toChars: function(bufSentence)
    {
        // var chars = bufSentence.join("");
        /* 一定要拷贝出来噢，缓存会被清空 */
        var sentence = bufSentence.slice(0);
        return sentence;
    },
    
    /**
     * 读取一串指定类型的字符，并放入 this.bufSentence
     * 
     * @param Seg_ReadChar readChar
     * @return integer readCharNum
     */
    readChars: function(readChar)
    {
        var num = 0;
        data = -1;
        
        while ((data = this.readNext()) != -1) {
            var d = readChar.transform(data);
            
            if (readChar.isRead(d)) {
                this.bufSentence.push(d);
                num ++;
            } else {
                this.pushBack();
                break;
            }
        }
        
        return num;
    }
});
