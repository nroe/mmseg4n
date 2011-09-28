#!/usr/bin/env node

var unitPath = __dirname + '/lib/nodeunit/index.js'

try {

    var reporter = require(unitPath).reporters.default;
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    console.log("You can download submodules for this project by doing:");
    console.log("");
    console.log("    git submodule init");
    console.log("    git submodule update");
    console.log("");
    process.exit();
}

process.chdir(__dirname);
reporter.run(['test']);