/**
 * Largest Average Word Length
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */
 
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter.js");

Analysis_Analyzer_MMSeg_ChunkFilter_LargestAvgLength = new JS.Class(Analysis_Analyzer_MMSeg_ChunkFilter, {
    initialize: function()
    {
        this.callSuper();
        this.largestAvgLength = 0;
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
        var chunkAvgLength = chunk.getAvgLength();
        if (chunkAvgLength > this.largestAvgLength) {
            this.largestAvgLength = chunkAvgLength;
            this.callSuper(chunk);
        }
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::isRemove
     */
    isRemove: function(chunk)
    {
        return (chunk.getAvgLength() < this.largestAvgLength);
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::resetChunks
     */
    reset: function()
    {
        this.largestAvgLength = 0;
        this.callSuper();
    }
});
