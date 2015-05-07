/**
 * 该模块中进行代码异常处理
 */

define(function(require, exports, module){
    
    'use strict';
    var $one = require('node').one;
    
    module.exports = {
        
        /**
         * 将错误信息打印到页面上
         */
        _errorDisplay: function(errorStr) {
            var open = true;
            if (!open || !$one('#J_error_display')) {
                return;
            }
            //本地环境与daily环境打印errorStr到页面上
            if (location.href.indexOf('localhost') > -1 || location.href.indexOf('daily') > -1) {
                $one('#J_error_display').append('<p style="color: #ff0000;">' + errorStr + '</p>');
            }
        },
        
        /**
         * 将错误信息记录到jstracker中
         * @param errorStr 错误信息内容
         */
        _jstracker: function(errorStr){
            if(window.JSTracker){
                JSTracker.log(errorStr);
            }
        },

        /**
         * 将错误信息打印到console中
         * @param errorStr 错误信息内容
         */
        _console: function(errorStr){
            if(typeof console.error === 'function'){
                console.error(errorStr);
            }
        },

        /**
         * 统一的异常处理
         * @param errorStr 错误信息内容
         */
        handleError: function(errorStr){
            this._errorDisplay(errorStr);
            this._jstracker(errorStr);
            this._console(errorStr);
        },

        /**
         * ajax请求异常统一处理
         * @param url 错误请求连接
         * @param param 请求参数
         * @param errorCode 错误码
         * @param errorInfo 错误信息
         */
        handleAjaxError: function(url, param, errorCode, errorInfo) {
            this.handleError('错误请求连接:'+url+';请求参数:'+JSON.stringify(param)+';错误码:'+errorCode+';错误信息:'+errorInfo)
        }
    };
    
});