/**
 * Analysis_Token 词，删除过短长度的词
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */
Analysis_TokenFilter_ShortWords = new JS.Class(Analysis_TokenFilter, {
    initialize: function(length)
    {
        if (null == length || undefined == length) {
            length = 2;
        }
        
        this.length = length;
    },
    
    /**
     * 过滤或删除 TOKEN
     * 
     * @param Analysis_Token token
     * @return token|null
     */
    normalize: function(srcToken)
    {
        if (strlen(strToken.getTermText()) < this.length) {
            return null;
        }
        else {
            return srcToken;
        }
    }
});
