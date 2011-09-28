
var hash = require(__dirname + "/../lib/hash.js");

this.hash = {
    'Hash -> md5': function (test) {
        test.ok(hash.MD5.hexdigest("abc"), "900150983cd24fb0d6963f7d28e17f72");
        test.ok(hash.MD5.hexdigest("abc!@#$%^&*()"), "499cb58d577596cc89dfc9ff348a55c1");
        test.done();
}};
