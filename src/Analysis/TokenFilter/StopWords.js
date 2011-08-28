/**
 * Analysis_Token 词，黑名单
 * 出现在黑名单中的词将全部被删除
 * 
 * @author Nroe
 * @package MMSeg4N.Analysis.TokenFilter
 */
Analysis_TokenFilter_StopWords = new JS.Class(Analysis_TokenFilter, {
    /**
     * 过滤或删除 TOKEN
     * 
     * @param Analysis_Token token
     * @return token|null
     */
    normalize: function(srcToken)
    {
    },
});
