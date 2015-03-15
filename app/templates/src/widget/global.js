/**
 * 跨模块通信数据存储模块，这里只做数据的global的set与get，以及globalEvent的埋入
 */

KISSY.add(function(S, require, exports, module){
    
    var Event=require('event');
    var globalEvent= S.mix({}, Event.Target);

    module.exports = {
        'globalEvent': globalEvent,
        'globalData': {
            //项目interface
            'ajaxUrls': {
                'sampleUrl': 'http://sm.admin.taobao.org/viewAll/xxx.do'
            }
        },
        /**
         * 获取globalData中的数据
         * @param key
         */
        'get': function(key){
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
        'set': function(key, value){
            var self=this;
            self.globalData[key]=value;
        }
        
    }
    
});