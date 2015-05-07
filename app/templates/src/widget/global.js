/**
 * 跨模块通信数据存储模块，这里只做数据的global的set与get，以及globalEvent的埋入
 */

define(function(require, exports, module){

    var CustomEvent = require('event-custom');
    var util = require('util');
    var globalEvent = util.mix({}, CustomEvent.Target);

    module.exports = {
        
        //自定义事件
        globalEvent: globalEvent,
        //自定义常量
        globalConst: {
            'JS_LIB': 'KISSY'
        },
        //全局数据
        globalData: {},
        /**
         * 获取globalData中的数据
         * @param key
         */
        get: function(key){
            var self=this;
            if(self.globalData.hasOwnProperty(key)){
                return self.globalData[key];
            }else{
                return null;
            }
        },
        /**
         * 设置globalData中的数据
         * @param key
         * @param value
         */
        set: function(key, value){
            var self=this;
            self.globalData[key]=value;
        }
        
    }
    
});