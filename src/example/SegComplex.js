/**
 * 加载词典并进行 Complex 分词
 */
ROOT_PATH = __dirname + '/..';
JSCLASS_PATH = ROOT_PATH + '/lib/JS.Class/src';

require(ROOT_PATH + "/Bootstrap.js");
require(ROOT_PATH + "/Seg.js");
require(ROOT_PATH + "/Seg/Dictionary.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/Complex.js");

var dic = new Seg_Dictionary(__dirname + '/../../data');
var complex = new Analysis_Analyzer_MMSeg_Complex(dic);
var text = "京华时报２００８年1月23日报道 昨天，受一股来自中西伯利亚的强冷空气影响，本市出现大风降温天气，白天最高气温只有零下7摄氏度，同时伴有6到7级的偏北风。";

var mmseg = new Seg(text, complex),
    words = new Array();

var startSegMemoryUsage = process.memoryUsage();
var startSegTimestamp = Date.now();

try {
    while ( (word = mmseg.next()) != null ) {
        words.push(word.getTermText());
    }
} catch (Exception) {
    
}

var endSegTimestamp = Date.now();
var endSegMemoryUsage = process.memoryUsage();
LOGGER.debug("complex memory usage:"
		+ ((endSegMemoryUsage.rss - startSegMemoryUsage.rss) / 1024 / 1024)
		+ "(MB) elapsed time:" + ((endSegTimestamp - startSegTimestamp) / 1000) + "(SEC)");

LOGGER.debug(words.join(" | "));
