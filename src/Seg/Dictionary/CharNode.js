/**
 * 字典存储节点
 * 
 * @author Nroe
 * @package MMSeg4N
 * @see com.chenlb.mmseg4j.CharNode
 */

Seg_Dictionary_CharNode = new JS.Class({
    initialize: function()
    {
        this.freq = -1;
        this.maxLen = 0;
        this.wordNum = 0;
        this.ktWordTails = new Seg_Dictionary_KeyTree();
    },
    
    getFreq: function()
    {
        return this.freq;
    },
    
    setFreq: function(freq)
    {
        this.freq = freq;
    },
    
    /**
     * @param Array wordTail unicode
     */
    addWordTail: function(wordTail)
    {
        this.ktWordTails.add(wordTail);
        this.wordNum++;
        if (wordTail.length > this.maxLen) {
            this.maxLen = wordTail.length;
        }
    },
    
    wordNum: function()
    {
        return this.wordNum;
    },
    
    /**
     * @return integer
     */
    indexOf: function(sen, offset, tailLen)
    {
        return this.ktWordTails.match(sen, offset+1, tailLen) ? 1 : -1;
    },
    
    /**
     * @return integer
     * @see Seg_Dictionary_KeyTree::maxMatchLength
     */
    maxMatchNodeLength: function(sen, wordTailOffset)
    {
        return this.ktWordTails.maxMatchNodeLength(sen, wordTailOffset);
    },
    
    /**
     * @return Array
     * @see Seg_Dictionary_KeyTree::maxMatchNodeLengthList
     */
    maxMatchNodeLengthList: function(tailLens, sen, wordTailOffset)
    {
        return this.ktWordTails.maxMatchNodeLengthList(tailLens, sen, wordTailOffset);
    },
    
    getMaxLen: function()
    {
        return this.maxLen;
    },
    
    setMaxLen: function(maxLen)
    {
        this.maxLen = maxLen;
    }
});

Seg_Dictionary_KeyTree = new JS.Class({
    initialize: function()
    {
        this.head = new Seg_Dictionary_TreeNode(' ');
    },
    
    add: function(w)
    {
        if (w.length < 1) {
            return;
        }
        
        var p = this.head;
        for (var i = 0; i < w.length; i ++) {
            var n = p.get(w[i]);
            if (null == n || undefined == n) {
                n = new Seg_Dictionary_TreeNode(w[i]);
                p.put(w[i], n);
            }
            
            p = n;
        }
        
        p.setAlsoLeaf();
    },
    
    /**
     * 匹配指定 sen 的第 offset 个位置开始在词库中最长的词的长度
     * 只匹配以 offset 为开始字符的第一个词
     * 
     * 如：
     *     词库：水果、水果摊
     *     匹配：水果摊的水果新鲜又好吃
     *     最大词长度：2 => 果摊
     * 
     * @param Array sen 匹配句子的 unicode
     * @param Integer offset 匹配 sen 起始位置
     * @return integer 返回匹配最长词的长度（词长度 - 1），未找到返回 0
     */
    maxMatchNodeLength: function(sen, offset)
    {
        var idx = offset - 1;
        var node = this.head;
        for (var i = offset; i < sen.length; i++) {
            node = node.get(sen[i]);
            if (null != node) {
                if (node.isAlsoLeaf()) {
                    idx = i;
                }
            } else {
                break;
            }
        }
        
        return idx - offset + 1;
    },
    
    /**
     * @return Array 
     */
    maxMatchNodeLengthList: function(tailLens, sen, offset)
    {
        var node = this.head;
        for (var i = offset; i < sen.length; i++) {
            node = node.get(sen[i]);
            if (null !=  node) {
                if (node.isAlsoLeaf()) {
                    tailLens.push(i - offset + 1);
                }
            } else {
                break;
            }
        }
        
        return tailLens;
    },
    
    match: function(sen, offset, len)
    {
        var node = this.head;
        for (var i = 0; i < len; i++) {
            node = node.get(sen[offset + i]);
            if (null == node || undefined == node) {
                return false;
            }
        }
        
        return node.isAlsoLeaf();
    }
});

Seg_Dictionary_TreeNode = new JS.Class({
    initialize: function(k)
    {
        this.key = k;
        this.subNodes = new JS.Hash([]);
        this.alsoLeaf = false;
    },
    
    getKey: function()
    {
        return this.key;
    },
    
    getSubNodes: function()
    {
        return this.subNodes;
    },
    
    put: function(key, sub)
    {
        this.subNodes.put(key, sub);
    },
    
    get: function(key)
    {
        return this.subNodes.get(key);
    },
    
    isAlsoLeaf: function()
    {
        return this.alsoLeaf;
    },
    
    setAlsoLeaf: function()
    {
        this.alsoLeaf = true;
    }
});