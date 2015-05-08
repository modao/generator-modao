/**
 * jshint reporter：将jshint的信息输出到根目录下的jshint.log文件中
 */


"use strict";
    
var fs = require('fs');
var LOG_FILE = 'jshint.log';

//清空jshint.log文件
fs.writeFileSync(LOG_FILE, '');

module.exports = {
    
    reporter: function(results){
        var errorStr;
        var err;
        results.forEach(function(error){
            err = error.error;
            errorStr = 'Filename:' + error.file + ';line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason;
            console.log(errorStr + '\n');
            fs.appendFileSync(LOG_FILE, errorStr + '\n');
        });
    }
    
};