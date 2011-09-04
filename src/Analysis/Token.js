/**
 * 词
 * 
 * @author Nroe
 * @package MMSeg4N.Analysis
 */
Analysis_Token = new JS.Class('Analysis_Token', {
    /**
     * @param Array|String 词
     * @param Integer 词在整个文本中的开始位置
     * @param Integer 词在整个文本中的结束位置
     * @param Integer 词类型
     */
    initialize: function(text, start, end, type)
    {
        /**
         * Unicode 码标示的数组
         */
        if (text instanceof Array) {
            this.termChars = text;
            this.termText = null;
        }
        /**
         * String
         */
        else {
            this.termText = text;
            this.termChars = new Array();
            for (var i=0; i<this.termText.length; i++) {
                this.termChars.push(this.termText[i].charCodeAt(0));
            }
        }
        
        if (null != type && undefined != type) {
            this.termType = type;
        } else {
            this.termType = Analysis_Token.TYPE_WORD;
        }
        
        this.startOffset = start;
        this.endOffset = end;
        this.length = this.termChars.length;
    },
    
    /**
     * 获取词长度
     * 
     * <code>
     *     var termLength = getTermText().length;
     * <code>
     * 
     * @return Integer
     */
    getLength: function()
    {
        return this.length;
    },
    
    /**
     * 获取词类型
     */
    getType: function()
    {
        return this.termType;
    },
    
    /**
     * 获取词
     * 
     * @return String
     */
    getTermText: function()
    {
        if (null == this.termText || undefined == this.termText) {
            for (var str = '', i=0; i<this.termChars.length; i++) {
                str += String.fromCharCode(this.termChars[i]);
            }
            
            this.termText = str;
        }
        
        return this.termText;
    },
    
    /**
     * 获取词以 unicode 码标示的数组
     * 
     * @return Array
     */
    getTermChars: function()
    {
        return this.termChars;
    },
    
    /**
     * 获取词在整个文本中的开始位置
     * 
     * @return Integer
     */
    getStartOffset: function()
    {
        return this.startOffset;
    },
    
    /**
     * 获取词在整个文本中的结束位置
     * 
     * @return Integer
     */
    getEndOffset: function()
    {
        return this.endOffset;
    },
    
    /**
     * 设置自由语素度（各单字词词频的对数之和）
     * 
     */
    setDegree: function(degree)
    {
        this.degree = degree;
    },
    
    /**
     * 获取词自由语素度
     * 
     * @return Float
     */
    getDegree: function()
    {
        return this.degree;
    }
});

/**
 * 句子，包含多个词的一串字符串
 * 
 * @author Nroe
 * @package MMSeg4N.Analysis
 */
Analysis_Sentence = new JS.Class(Analysis_Token, {
    /**
     * @param Array|String 句子
     * @param Integer 句子在整个文本中的开始位置
     * @param Integer 句子在整个文本中的结束位置
     * @param Integer 词类型
     */
    initialize: function(text, start, end, type)
    {
        this.callSuper(text, start, end, type);
        this.segOffset = 0; /* 句子分词处理位置 */
    },
    
    /**
     * 判断句子是否已处理（分词）完毕
     * 
     * @return Boolean
     */
    isSegFinish: function()
    {
        return (this.segOffset >= this.termChars.length);
    },
    
    /**
     * 获取句子处理偏移位置
     * 
     * @return Integer
     */
    getSegOffset: function()
    {
        return this.segOffset;
    },
    
    /**
     * 设置句子处理偏移位置
     * 
     * @return void
     */
    setSegOffset: function(offset)
    {
        this.segOffset = offset;
    },
});

/**
 * Chunk中包含依据上下文分出的一组词和相关的属
 * 包括长度(Length)、平均长度(Average Length)、标准差的平方(Variance)和自由语素度(Degree Of Morphemic Freedom)。
 * 
 * @see Analysis_Token
 */
Analysis_Chunk = new JS.Class({
    initialize: function(text, start, type)
    {
        this.tokens = new Array();
        this.length = 0;
        this.count = 0;
        
        this.avgLength = -1;
        this.variance = -1;
        this.degree = -1;
    },
    
    /**
     * 获取 Chunk 中所有 Token 长度
     * 
     * @return Integer
     */
    getLength: function()
    {
        return this.length;
    },
    
    /**
     * 获取 Chunk 中含有 Token 数量
     * 
     * @return Integer
     */
    getCount: function()
    {
        return this.count;
    },
    
    /**
     * @param Analysis_Token token
     */
    addToken: function(token)
    {
        this.tokens.push(token);
        this.count ++;
        this.length += token.getLength();
    },
    
    getTokenCount: function()
    {
        return this.tokens.length;
    },
    
    getTokens: function()
    {
        return this.tokens;
    },
    
    /**
     * 获取 Token 平均长度
     * 
     * @return Float
     */
    getAvgLength: function()
    {
        if (this.avgLength < 0) {
            this.avgLength = this.length / this.count;
        }
        
        return this.avgLength;
    },
    
    /**
     * Variance of Word Lengths 就是 标准差的平方
     * 
     * @return Float
     */
    getVariance: function()
    {
        if (this.variance < 0) {
            var sum = 0;
            for (var i=0; i<this.count; i++) {
                if (null != this.tokens[i]) {
                   sum += Math.pow(this.tokens[i].getLength() - this.getAvgLength(), 2);
                }
            }
            this.variance = sum / this.count;
        }
        
        return this.variance;
    },
    
    /**
     * Sum of Degree of Morphemic Freedom of One-Character
     * 
     * @return Float
     */
    getDegree: function()
    {
        if (this.degree < 0) {
            this.degree = 0;
            for (var i=0; i<this.count; i++) {
                if (null != this.tokens[i]) {
                    var tokenDegree = this.tokens[i].getDegree();
                    if (tokenDegree > -1) {
                        this.degree += tokenDegree;
                    }
                }
            }
        }
        
        return this.degree;
    },
    
    toString: function()
    {
        var strBuf = new Array();
        for (var i=0; i<this.tokens.length; i++) {
            strBuf.push(this.tokens[i].getTermText());
        }
        
        return strBuf.join("_");
    }
});

Analysis_Token.TYPE_WORD = "word";
Analysis_Token.TYPE_LETTER = "letter";

/** 字母开头的"字母或数字" */
Analysis_Token.TYPE_LETTER_OR_DIGIT = "letter_or_digit";
Analysis_Token.TYPE_DIGIT = "digit";

/** 数字开头的"字母或数字" */
Analysis_Token.TYPE_DIGIT_OR_LETTER = "digit_or_letter";
Analysis_Token.TYPE_LETTER_NUMBER = "letter_number";
Analysis_Token.TYPE_OTHER_NUMBER = "other_number";
