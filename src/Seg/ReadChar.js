/**
 * 词典
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Seg
 * @see mmseg4j.MMSeg.java
 */

require(ROOT_PATH + "/Lang/Character.js");

/**
 * 读取下一串指定类型字符
 */
Seg_ReadChar = new JS.Class({
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRead: function (codePoint)
    {
        return true;
    },
    
    /**
     * @param integer codePoint
     * @return codePoint
     */
    transform: function(codePoint)
    {
        return codePoint;
    },
    
    /**
     * 双角转单角
     * 
     * @param integer codePoint
     * @return integer
     */
    toAscii: function(codePoint)
    {
        if((codePoint>=65296 && codePoint<=65305)   //０-９
                || (codePoint>=65313 && codePoint<=65338)   //Ａ-Ｚ
                || (codePoint>=65345 && codePoint<=65370)   //ａ-ｚ
                ) { 
            codePoint -= 65248;
        }
        
        return codePoint;
    },
    

    /**
     * 读取字符串
     */
    getNation: function(codePoint)
    {
        if (this.isAsciiLetter(codePoint)) {
            return Seg_ReadChar.NationLetter.EN;
        }
        if (this.isRussiaLetter(codePoint)) {
            return Seg_ReadChar.NationLetter.RA;
        }
        if (this.isGreeceLetter(codePoint)) {
            return Seg_ReadChar.NationLetter.GE;
        }
        
        return Seg_ReadChar.NationLetter.UNKNOW;
    },
    
    /**
     * letter table
     * 
     * <code>
     * var str = "AZazАяЁёΑΩαω";
     * for(var i = 0; i < str.length; i++) {
     *     console.log("str:" + str[i] + " code:" + str[i].charCodeAt(0));
     * }
     * </code>
     */
    /**
     * @param integer codePoint
     * @return boolean
     */
    isAsciiLetter: function(codePoint)
    {
        return ((codePoint >= 65 && codePoint <= 90) || (codePoint >= 97 && codePoint <= 122));
    },
    
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRussiaLetter: function(codePoint)
    {
        return ((codePoint >= 1040 && codePoint <= 1103) || (codePoint >= 1025 && codePoint <= 1105));
    },
    
    /**
     * @param integer codePoint
     * @return boolean
     */
    isGreeceLetter: function(codePoint)
    {
        return ((codePoint >= 913 && codePoint <= 937) || (codePoint >= 945 && codePoint <= 969));
    },
});

Seg_ReadChar.NationLetter = {EN:"EN", RA:"RA", GE:"GE", UNKNOW:"UNKNOW"};

/**
 * 指定类型字符
 */
Seg_ReadCharByType = new JS.Class(Seg_ReadChar, {
    initialize: function(type)
    {
        this.charType = type;
    },
    
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRead: function (codePoint)
    {
        var type = Lang_Character.prototype.getType(codePoint);
        return (type == this.charType);
    }
});

/**
 * 读取数字
 */
Seg_ReadCharDigit = new JS.Class(Seg_ReadChar, {
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRead: function (codePoint)
    {
        var type = Lang_Character.prototype.getType(codePoint);
        return (type == Lang_Character.DECIMAL_DIGIT_NUMBER);
    },
    
    /**
     * @param integer codePoint
     * @return codePoint
     */
    transform: function(codePoint)
    {
        return this.toAscii(codePoint);
    },
});

/**
 * 字母或数字
 */
Seg_ReadCharByAsciiOrDigit = new JS.Class(Seg_ReadCharDigit, {
    initialize: function()
    {
        this.hasDigitFlat = false;
    },
    
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRead: function (codePoint)
    {
        var isRead = this.callSuper(codePoint);
        this.hasDigitFlat |= isRead;
        return (Seg_ReadChar.prototype.isAsciiLetter(codePoint) || isRead);
    },
    
    hasDigit: function()
    {
        return this.hasDigitFlat;
    }
});

/**
 * 俄语
 */
Seg_ReadCharByRussia = new JS.Class(Seg_ReadCharDigit, {
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRead: function(codePoint)
    {
        return Seg_ReadChar.prototype.isRussiaLetter(codePoint);
    }
});

/**
 * 希腊
 */
Seg_ReadCharByGreece = new JS.Class(Seg_ReadCharDigit, {
    /**
     * @param integer codePoint
     * @return boolean
     */
    isRead: function(codePoint)
    {
        return Seg_ReadChar.prototype.isGreeceLetter(codePoint);
    }
});
