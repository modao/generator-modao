/**
 * 样例页面模块的js逻辑
 */

define(function(require, exports, module){
    
    'use strict';
    var util = require('util');
    
    function ModName(){
        
       
    }
    
    util.augment(ModName, {
        'init': function(){
            
            alert('page mod init!');
            
        },
        
        '_privite': function(){
            
            
        },
        
        'bindEvent': function(){
            
            
        }
        
    });
    
    module.exports = ModName;
    
});