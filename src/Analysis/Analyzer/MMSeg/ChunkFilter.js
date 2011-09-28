/**
 * Chunk 过滤器
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */

Analysis_Analyzer_MMSeg_ChunkFilter = new JS.Class({
    chunks : null,
    
    initialize: function()
    {
        this.chunks = new Array();
    },
    
    addChunks: function(chunks)
    {
        for (var i=0; i<chunks.length; i++) {
            this.addChunk(chunks[i]);
        }
    },
    
    /**
     * 添加 chunk
     * 
     * @param Analysis_Chunk chunk
     * @return void
     */
    addChunk: function(chunk)
    {
        this.chunks.push(chunk);
    },
    
    getChunks: function()
    {
        return this.chunks;
    },
    
    /**
     * 获取过滤后的 Chunks
     * 
     * @return Array 
     */
    remain: function()
    {
        var filtered = new Array(); 
        for (var i=0; i<this.chunks.length; i++) {
            var chunk = this.chunks[i];
            if (!this.isRemove(chunk)) {
                filtered.push(chunk);
            }
        }
        
        return filtered;
    },
    
    /**
     * 判断 chunk 是否需要在 remianChunks 中移除
     * 
     * @return Boolean
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::remainChunks()
     */
    isRemove: function(chunk)
    {
        return false;
    },
    
    /**
     * 重置 Chunks
     */
    reset: function()
    {
        this.chunks.length = 0;
    }
});
