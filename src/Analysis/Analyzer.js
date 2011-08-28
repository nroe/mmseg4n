/**
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */
Analysis_Analyzer = new JS.Class({
    /**
     * @param Seg_Dictionary dic
     * @return void
     */
    setDictionary: function(dic)
    {
        this.dic = dic;
    },
    
    /**
     * @see Seg_Dictionary::isUnit
     */
    isUnit: function(codePoint)
    {
        return this.dic.isUnit(codePoint);
    },
    
    /**
     * 分词
     * 
     * @param Analysis_Sentence
     * @return Analysis_Chunk
     */
    seg: function(sen)
    {
        return new Analysis_Chunk();
    },
    
    /**
     * 最大匹配
     * 匹配 chs[offset] 字符保存在 cns[cnIdx]
     * 
     * @param Array Seg_Dictionary_CharNode list
     * @param Integer cnIndex
     * @param Array chs
     * @param Integer offset
     * @return Integer 匹配最长词长度，没有返回 0
     * 
     * @see Seg_Dictionary::maxMatchNodeLength
     */
    maxMatch: function(cns, cnIdx, chs, offset)
    {
        var cn = null;
        if (offset < chs.length) {
            cn = this.dic.get(chs[offset]);

        }
        
        cns[cnIdx] = cn;
        return this.dic.maxMatchNodeLengthByNode(cn, chs, offset);
    },
    
    /**
     * @see Seg_Dictionary::maxMatchNodeLengthList
     */
    maxMatchList: function(cns, cnIdx, chs, offset, tailLens, tailLensIdx)
    {
        var cn = null;
        if (offset < chs.length) {
            cn = this.dic.get(chs[offset]);
        }
        
        cns[cnIdx] = cn;
        this.dic.maxMatchNodeLengthList(cn, tailLens[tailLensIdx], chs, offset);
    }
});