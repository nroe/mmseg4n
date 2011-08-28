/**
 * Maximum Matching 过滤器
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */
 
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter.js");

Analysis_Analyzer_MMSeg_ChunkFilter_MaxMatch = new JS.Class(Analysis_Analyzer_MMSeg_ChunkFilter, {
    initialize: function()
    {
        this.callSuper();
        this.maxChunkLength = 0;
    },
    
    /**
     * 添加 chunk
     * 
     * @param Analysis_Chunk chunk
     * @return void
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::addChunk
     */
    addChunk: function(chunk)
    {
        var chunkLength = chunk.getLength();
        if (chunkLength >= this.maxChunkLength) {
            this.maxChunkLength = chunkLength;
            this.callSuper(chunk);
        }
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::isRemove
     */
    isRemove: function(chunk)
    {
        return (chunk.getLength() < this.maxChunkLength);
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::resetChunks
     */
    reset: function()
    {
        this.maxChunkLength = 0;
        this.callSuper();
    }
});
