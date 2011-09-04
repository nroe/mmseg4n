/**
 * 加载词典
 */
ROOT_PATH = __dirname + '/..';
JSCLASS_PATH = ROOT_PATH + '/lib/JS.Class/src';

require(ROOT_PATH + "/Bootstrap.js");
require(ROOT_PATH + "/Seg.js");
require(ROOT_PATH + "/Seg/Dictionary.js");

var dic = new Seg_Dictionary(__dirname + '/../../data');
