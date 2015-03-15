/**
 * 该文件是与业务无关的通用API，不断完善该文件能够减少重复开发
 */

KISSY.add(function(S, require, exports, module){
    
    var Node=require('node');
    var IO=require('io');
    var Uri=require('uri');
    module.exports={
        /**
         * IO请求
         * @param ajaxUrl ajax请求url
         * @param ajaxOpt ajax请求参数
         * @param callback 回调方法
         */
        'commonAjax': function(ajaxUrl, ajaxOpt, callback){
            var self=this;
            IO({
                'type': 'get',
                'url': ajaxUrl,
                'data': ajaxOpt,
                'dataType': 'jsonp',
                'jsonp': 'callback',
                'complete': function(data){
                    callback && callback.call(this, data);
                },
                'error': function(){
                    S.log('接口调用错误');
                    self.errorDisplay('接口调用错误');
                }
            });
            
        },
        /**
         * 将错误信息打印到页面上
         */
        'errorDisplay': function(errorStr) {
            var open = true;
            if (!open || !S.one('#J_error_display')) {
                return;
            }
            //本地环境与daily环境打印errorStr到页面上
            if (location.href.indexOf('localhost') > -1 || location.href.indexOf('daily') > -1) {
                S.one('#J_error_display').append('<p style="color: #ff0000;">' + errorStr + '</p>');
            }
        },
        /**
         * 从某个url中获取某参数的值
         * @param url 链接
         * @param key 待提取的参数key
         */
        'getParamFromUrl': function(url, key){
            return new Uri(url).getQuery().get(key);
        }
    };
    
});