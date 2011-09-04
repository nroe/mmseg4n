/**
 * 分词分析器
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */

require(ROOT_PATH + "/Analysis/Analyzer.js");

Analysis_Analyzer_Common = new JS.Class(Analysis_Analyzer, {
    addFilter: function(filter)
    {
        this.filters.push(filter);
    },
    
    /**
     * 过滤词，当返回 null 时表示该词被删除
     * 
     * @param Analysis_Token token
     * @param Analysis_Token|null
     */
    normalize: function(token)
    {
        for (var i=0; i<this.filters.length; i++) {
            token = this.filters[i].normalize(token);
            
            if (null == token) {
                return null;
            }
        }
        
        return token;
    }
});

 