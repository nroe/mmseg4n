/**
 * Smallest Variance of Word Lengths
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */
 
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter.js");

Analysis_Analyzer_MMSeg_ChunkFilter_SmallestVariance = new JS.Class(Analysis_Analyzer_MMSeg_ChunkFilter, {
    smallestVariance : Number.MAX_VALUE,
    
    initialize: function()
    {
        this.callSuper();
    },
    
    addChunks: function(chunks)
    {
        this.callSuper(chunks);
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
        var chunkVariance = chunk.getVariance();
        if (chunkVariance <= this.smallestVariance) {
            this.smallestVariance = chunkVariance;
            this.callSuper(chunk);
        }
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::isRemove
     */
    isRemove: function(chunk)
    {
        return (chunk.getVariance() > this.smallestVariance);
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::resetChunks
     */
    reset: function()
    {
        this.smallestVariance = Number.MAX_VALUE;
        this.callSuper();
    }
});
