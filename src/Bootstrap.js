
require(JSCLASS_PATH + "/loader");

JS.require('JS.Console');
JS.require('JS.Class');
JS.require('JS.Hash');

var log4js = require(ROOT_PATH + "/lib/log4js/lib/log4js.js");

log4js.configure({
	appenders: [{
		category: "mmseg4n",
		type: "console",
	},
	{
		category: "mmseg4n",
		type: "file",
		filename: "mmseg4n.log",
		layout: {
			type: "messagePassThrough"
		}
	}]
});

LOGGER = log4js.getLogger("mmseg4n");
