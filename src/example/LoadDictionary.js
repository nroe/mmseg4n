/**
 * 加载词典
 */
ROOT_PATH = __dirname + '/..';
JSCLASS_PATH = ROOT_PATH + '/lib/JS.Class/src';

require(ROOT_PATH + "/Bootstrap.js");
require(ROOT_PATH + "/Seg.js");
require(ROOT_PATH + "/Seg/Dictionary.js");

var util    = require('util');

var startDicMemoryUsage = process.memoryUsage(),
    startDicTimestamp = Date.now();

var dic = new Seg_Dictionary(__dirname + '/../../data');

setTimeout(function() {
    if (dic.isDicLoaded) {
        var info = dic.getDistInfo();
        var endDicMemoryUsage = process.memoryUsage(),
            endDicTimestamp = Date.now();
        
//        LOGGER.debug("dist:" + util.inspect(dic.getDist(), true, null));
        
        LOGGER.debug("loaded dictionary successfully. word count:" + info.count + " word length:" + info.length);
        LOGGER.debug(" load the dictionary require memory:"
                + ((endDicMemoryUsage.rss - startDicMemoryUsage.rss) / 1024 / 1024)
                + "(MB), elapsed time:" + ((endDicTimestamp - startDicTimestamp) / 1000) + "(SEC)");
    } else {
        LOGGER.debug("dictionary loading...");
    }
},1000);
