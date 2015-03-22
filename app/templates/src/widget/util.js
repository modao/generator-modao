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
                'dataType': 'json',
                'success': function(data){
                    /*data结构
                     data = {
                         'resultData': {interfaceData},
                         'success': boolean,
                         'errorCode': errorCode,
                         'errorInfo': errorInfo
                     }
                     */
                    if(data && data.success && data.resultData){
                        callback && callback.call(this, data.resultData);
                    }else{
                        self.handleAjaxError(ajaxUrl, ajaxOpt, data.errorCode, data.errorInfo);
                    }
                },
                'error': function(){
                    self.handleAjaxError(ajaxUrl, ajaxOpt, -1, 'ajax接口调用失败');
                }
            });
        },
        /**
         * 错误处理，jstracker日志记录
         */
        handleAjaxError: function(url, param, errorCode, errorInfo) {
            var self=this;
            self.handleError('错误请求连接:'+url+';请求参数:'+JSON.stringify(param)+';错误码:'+errorCode+';错误信息:'+errorInfo)
        },
        /**
         * 统一的错误处理逻辑
         * @param msg 错误信息
         */
        'handleError': function(msg){
            var self=this;
            self.errorDisplay(msg);
            JSTracker.log(msg);
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
        },
        /**
         * 日期计算
         * 计算d日期前n天或后n天的日期（n的取值可以为正负）
         * format为返回日期格式，其值可以为date或string
         */
        'calDate': function(n, d, format){
            //计算d天的前几天或者后几天，返回date,注：chrome下不支持date构造时的天溢出
            var uom = new Date(d - 0 + n * 86400000);
            var month, day;
            if(format == 'date'){
                uom = uom.getFullYear() + "/" + (uom.getMonth() + 1) + "/" + uom.getDate();
                return new Date(uom);
            }else if(format == 'string'){
                month=uom.getMonth()+1;
                day=uom.getDate();
                month=month>=10 ? month : '0'+month;
                day=day>=10 ? day : '0'+day;
                return uom.getFullYear() + "-" + month + "-" + day;
            }
        },
        /**
         * 存储sessionStorage数据
         */
        'setSessionStorage': function(key, value){
            window.sessionStorage.setItem(key, value);
        },
        /**
         * 获取sessionStorage数据
         */
        'getSessionStorage': function(key){
            if(window.sessionStorage.getItem(key)){
                return window.sessionStorage.getItem(key);
            }else{
                return null;
            }
        },
        /**
         * 存储localStorage数据
         */
        'setLocalStorage': function(key, value){
            window.localStorage.setItem(key, value);
        },
        /**
         * 获取localStorage数据
         */
        'getLocalStorage': function(key){
            if(window.localStorage.getItem(key)){
                return window.localStorage.getItem(key);
            }else{
                return null;
            }
        }
    };
    
});