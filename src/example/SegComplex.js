/**
 * 加载词典并进行 Complex 分词
 */
ROOT_PATH = __dirname + '/..';
JSCLASS_PATH = ROOT_PATH + '/lib/JS.Class/src';

require(ROOT_PATH + "/Bootstrap.js");
require(ROOT_PATH + "/Seg.js");
require(ROOT_PATH + "/Seg/Dictionary.js");
require(ROOT_PATH + "/Analysis/Analyzer/MMSeg/Complex.js");

var util    = require('util');
var dic = new Seg_Dictionary(__dirname + '/../../data');
var startSegMemoryUsage = process.memoryUsage(),
    startSegTimestamp = Date.now();

var interval = setInterval(function() {
    if (dic.isDicLoaded()) {        
        var complex = new Analysis_Analyzer_MMSeg_Complex(dic);
//        var text = "京华时报２００８年1月23日报道 昨天，受一股来自中西伯利亚的强冷空气影响，本市出现大风降温天气，白天最高气温只有零下7摄氏度，同时伴有6到7级的偏北风。";
//        var text = "１９９７年，是中国发展历史上非常重要的很不平凡的一年。中国人民决心继承邓小平同志的遗志，继续把建设有中国特色社会主义事业推向前进。[中国政府]nt顺利恢复对香港行使主权，并按照“一国两制”、“港人治港”、高度自治的方针保持香港的繁荣稳定。[中国共产党]nt成功地召开了第十五次全国代表大会，高举邓小平理论伟大旗帜，总结百年历史，展望新的世纪，制定了中国跨世纪发展的行动纲领。";
//        var text = "国家主席江泽民";
        var text = "我们要更好地坚持以经济建设为中心。各项工作必须以经济建设为中心，是邓小平理论的基本观点，是党的基本路线的核心内容，近２０年来的实践证明，坚持这个中心，是完全正确的。今后，我们能否把建设有中国特色社会主义伟大事业全面推向２１世纪，关键仍然要看能否把经济工作搞上去。各级领导干部要切实把精力集中到贯彻落实好中央关于今年经济工作的总体要求和各项重要任务上来，不断提高领导经济建设的能力和水平。";
        var text = "贺词1997年是我国历史";
        var text = "五、“银河—Ⅲ”百亿次计算机研制成功。这标志着我国具备了研制更高性能巨型机的能力。";
        var text = "编者的话：“文化视角”专栏新年伊始与大家见面了。它将从平民百姓的日常生活中，拈出一些人们“熟视无睹”的现象，作出分析，借以揭示当代生活方式、社会心理、价值观、审美趣味等等复杂而微妙的变迁。中国正处在一个转型期，不仅经济体制在转型，积淀在大众血液中的传统文化基因也在传承中发生种种变异。本专栏只是对这些变迁和变异的细枝末节讲上只言片语，但也未尝不是一篇篇微型的文化学论文呢！当然，这是广义的“文化视角”，也是非专业人士和大众的文化讲坛。我们计划从第二期开始，一边搜集和发表读者对上期话题的反馈，一边推出新的话题。欢迎读者来稿、来电，对本专栏的文字品头论足，并且点题。稿件请寄：[北京人民日报教科文部文化组]nt，邮政编码：１００７３３。电话：６５０９１０４０，６５０９２１４０。";
        var mmseg = new Seg(text, complex),
            words = new Array();

        while ( (word = mmseg.next()) != null ) {
            words.push(word.getTermText());
        }
        LOGGER.debug("complex result:\"" + words.join(" | ") + "\"");
        
        var endSegMemoryUsage = process.memoryUsage(),
            endSegTimestamp = Date.now();
        
        LOGGER.debug("complex require memory:"
                + ((endSegMemoryUsage.rss - startSegMemoryUsage.rss) / 1024 / 1024)
                + "(MB), elapsed time:" + ((endSegTimestamp - startSegTimestamp) / 1000) + "(SEC)");
        clearInterval(this);
    } else {
        LOGGER.debug("dictionary is loading ...");
    }
},1000);
