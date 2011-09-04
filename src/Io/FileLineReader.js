/**
 * 文件逐行读取
 * 
 * @author Nroe
 * @package MMSeg4N.io
 */

var fs = require("fs");

Io_FileLineReader = new JS.Class({
    initialize: function(filename, bufferSize)
    {
        if(!bufferSize) {
            bufferSize = 8192;
        }
        
        this.readBufferSize = bufferSize;
        
        //private:
        this.currentPositionInFile = 0;
        this.buffer = "";
        this.fd = fs.openSync(filename, "r");
        this.currentPositionInFile = this.fillBuffer(0);
    },
    
    // return -1
    // when EOF reached
    // fills buffer with next 8192 or less bytes
    fillBuffer: function (position)
    {
        var res = fs.readSync(this.fd, this.readBufferSize, position, "utf8");
        
        this.buffer += res[0];
        if (res[1] == 0) {
            return -1;
        }
        
        return position + res[1];
    },
    
    /**
     * 判断是否存在下行
     * 
     * @return boolean
     * @public
     */
    hasNextLine: function ()
    {
        while (this.buffer.indexOf("\n") == -1) {
            this.currentPositionInFile = this.fillBuffer(this.currentPositionInFile);
            if (this.currentPositionInFile == -1) {
                return false;
            }
        }
        
        if (this.buffer.indexOf("\n") > -1) {
            return true;
        }
        
        return false;
    },
    
    /**
     * 获取下行数据
     * 
     * @return string
     * @public
     */
    nextLine: function ()
    {
        var lineEnd = this.buffer.indexOf("\n");
        var result = this.buffer.substring(0, lineEnd);
        
        this.buffer = this.buffer.substring(result.length + 1, this.buffer.length);
        return result;
    }
});
