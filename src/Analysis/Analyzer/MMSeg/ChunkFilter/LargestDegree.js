/**
 * Largest Sum of Degree of Morphemic Freedom of One-Character Words
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */
 
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter.js");

Analysis_Analyzer_MMSeg_ChunkFilter_LargestDegree = new JS.Class(Analysis_Analyzer_MMSeg_ChunkFilter, {
    initialize: function()
    {
        this.callSuper();
        this.largestDegree = -0x80000000;
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
        var chunkDegree = chunk.getDegree();
        if (chunkDegree > this.largestDegree) {
            this.largestDegree = chunkDegree;
            this.callSuper(chunk);
        }
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::isRemove
     */
    isRemove: function(chunk)
    {
        return (chunk.getDegree() < this.largestDegree);
    },
    
    /**
     * @see Analysis_Analyzer_MMSeg_ChunkFilter::resetChunks
     */
    reset: function()
    {
        this.largestDegree = -0x80000000;
        this.callSuper();
    }
});
