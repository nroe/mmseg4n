/**
 * 正向最大匹配, 加四个过虑规则的分词方式
 * 
 * @author Nroe
 * @package MMSeg4N
 * @subpackage Analysis
 */

require(ROOT_PATH + "/Analysis/Analyzer/Common.js");

require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter/LargestAvgLength.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter/LargestDegree.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter/MaxMatch.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/ChunkFilter/SmallestVariance.js");

var util = require('util');



Analysis_Analyzer_MMSeg_Complex = new JS.Class(Analysis_Analyzer_Common, {
    initialize: function(dic)
    {
        this.setDictionary(dic);
        
        /**
         * 设置过滤器
         */
        this.maxMatchFilter = new Analysis_Analyzer_MMSeg_ChunkFilter_MaxMatch();
        this.otherFilter = new Array();
        this.otherFilter.push(new Analysis_Analyzer_MMSeg_ChunkFilter_LargestAvgLength());
        this.otherFilter.push(new Analysis_Analyzer_MMSeg_ChunkFilter_SmallestVariance());
        this.otherFilter.push(new Analysis_Analyzer_MMSeg_ChunkFilter_LargestDegree());
    },
    
    seg: function(sen)
    {
        var chs = sen.getTermChars();
        var offsets = new Array(3);
        var cns = new Array();
        var tailLens = new Array(2),
            tailLen = new Array(3); /* 记录词的尾长 */
        for (var i=0;i<2;i++) {
            tailLens[i] = new Array();
        }
        
        this.maxMatchFilter.reset();
        
        if (! sen.isSegFinish()) {
            var maxLen = 0;
            /**
             * sen 起始 offset 从 0 位置开始
             */
            offsets[0] = sen.getSegOffset();
            this.maxMatchList(cns, 0, chs, offsets[0], tailLens, 0);
//            LOGGER.debug("complex maxMatchList:" + tailLens[0].length + " tailLens:" + tailLens);
            for (var aIdx = tailLens[0].length - 1; aIdx >=0; aIdx --) {
                tailLen[0] = tailLens[0][aIdx];
                offsets[1] = offsets[0]+1+tailLen[0];   //第二个词的开始位置
//                LOGGER.debug("for offsets:" + offsets[1] + " offsets[0]:" + offsets[0] + " tailLen[0]:" + tailLen[0] + " aIdx:" + aIdx);
                
                this.maxMatchList(cns, 1, chs, offsets[1], tailLens, 1);
                for (var bIdx=tailLens[1].length-1; bIdx >=0; bIdx--) {
                    tailLen[1] = tailLens[1][bIdx];
                    offsets[2] = offsets[1]+1+tailLen[1];
    
                    //第三个词只需要最长的
                    tailLen[2] = this.maxMatch(cns, 2, chs, offsets[2]);
//                    LOGGER.debug("for maxMatch tailLen[2]:" +tailLen[2] + " param ----> cns:" + cns+ " chs:" + chs+" offsets[2]:"+offsets[2]);
    
                    var sumChunkLen = 0;
                    for (var i=0; i<3; i++) {
                        sumChunkLen += tailLen[i]+1;
                    }
                    
                    var ck = new Analysis_Chunk();
                    if (sumChunkLen >= maxLen) {
                        maxLen = sumChunkLen;   //下一个chunk块的开始位置增量
                        ck = this.createChunk(sen, tailLen, offsets, cns);
//                        LOGGER.debug("maxMatch add Chunk:" + ck.toTraceString());
                        this.maxMatchFilter.addChunk(ck);
                    }
                }
            }
            
//            LOGGER.debug("sen setSegOffset: " + (offsets[0] + maxLen) + " maxLen:" + maxLen);
            sen.setSegOffset(offsets[0] + maxLen);
            
            /**
             * 应用过滤器
             */
            var chunks = this.maxMatchFilter.remain(),
                filter = null;
            
            /* DEBUG CHUNKS */
//            LOGGER.debug("=================");
//            for (var l=0; l<chunks.length; l++) {
//                LOGGER.debug(util.inspect(chunks[l].toTraceString(), true, null));
//            }
            
            for (var i=0; i<this.otherFilter.length; i++) {
                filter = this.otherFilter[i];
                
                if (chunks.length > 1) {
                    filter.reset();
                    filter.addChunks(chunks);
                    chunks = filter.remain();
                } else {
                    break;
                }
            }
            
            if (chunks.length > 0) {
                // return chunks.slice(0, 1);
                return chunks[0];
            }
        }
        
        return null;
    },
    
    /**
     * @param Array chs unicode
     */
    createChunk: function(sen, tailLen, offsets, cns)
    {
        var chs = sen.getTermChars(),
            senStartOffset = sen.getStartOffset(),
            chunk = new Analysis_Chunk();
        
        for (var i=0; i< 3; i++) {
            if (offsets[i] < chs.length) {
                // console.log("ceateChunk offsets[i]:" +offsets[i] + " tailLen[i]+1:" + (tailLen[i]+1));
                var 
                    termLength = tailLen[i] + 1;
                    termChars = chs.slice(offsets[i], offsets[i] + termLength);
                
                var token = new Analysis_Token(termChars, (senStartOffset + offsets[i]), (senStartOffset + offsets[i] + termLength));
//                LOGGER.debug("token:" + token.getTermText() + " startOffset:" + token.getStartOffset() + " endOffset:" + token.getEndOffset() + " type:" + token.getType());
                
                if (tailLen[i] == 0) {
                   var cn = cns[i];
                   if (cn != null) {
                       token.setDegree(cn.getFreq());
                   }
                }
                
                chunk.addToken(token);
            }
        }
        
        return chunk;
    },
});