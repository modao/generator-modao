/**
 * 该文件是与业务无关的通用API，不断完善该文件能够减少重复开发
 */

define(function(require, exports, module){
    
    'use strict';
    
    var Node = require('node');
    var IO = require('io');
    var Url = require('url');
    var util = require('util');
    var QueryString = require('querystring');
    
    var Interface = require('./interface');
    var ErrorHandle = require('./error');
    
    module.exports={
        /**
         * IO请求
         * @param ajaxUrl ajax请求url
         * @param ajaxOpt ajax请求参数
         * @param successCb 成功的回调方法
         * @param failCb 失败的回调方法
         */
        commonAjax: function(ajaxUrl, ajaxOpt, successCb, failCb){
            ajaxOpt=ajaxOpt || {};
            IO({
                'type': Interface.getAjaxType() || 'get',
                'url': ajaxUrl,
                'data': ajaxOpt,
                'dataType': Interface.getDataType() || 'json',
                'xhrFields':{
                    'withCredentials': true
                },
                'success': function(data){
                    /* data参考结构
                       data = {
                           'resultData': {interfaceData},
                           'success': boolean,
                           'errorCode': errorCode,
                           'errorInfo': errorInfo,
                           'errorStatus': errorStatus
                       }
                    */

                    if (data && data.success && data.resultData) {
                        successCb && successCb.call(this, data.resultData);
                    } else {
                        ErrorHandle.handleAjaxError(ajaxUrl, ajaxOpt, data.errorCode, data.errorInfo, data.errorStatus);
                        failCb && failCb.call(this, data);
                    }
                },
                'error': function(data, errorText, io){
                    ErrorHandle.handleAjaxError(ajaxUrl, ajaxOpt, io.status, io.statusText);
                    failCb && failCb();
                }
            });

        },

        /**
         * 从某个url中获取某参数的值
         * @param url 链接
         * @param key 待提取的参数key
         */
        'getParamFromUrl': function(url, key){
            return Url.parse(url, true).query[key];
        },
        
        /**
         * 日期计算
         * 计算d日期前n天或后n天的日期（n的取值可以为正负）
         * format为返回日期格式，其值可以为date或string
         */
        'calDate': function(n, d, format){
            //计算d天的前几天或者后几天，返回date,注：chrome下不支持date构造时的天溢出
            var uom = new Date(d - 0 + n * 86400000);
            var month,
                day;
            if(format === 'date'){
                return uom;
            }else if(format === 'string'){
                month = uom.getMonth() + 1;
                day = uom.getDate();
                month = month >= 10 ? month : ('0' + month);
                day = day >= 10 ? day : ('0' + day);
                return uom.getFullYear() + '-' + month + '-' + day;
            }
        },
        
        /**
         * 将时间戳格式的日期转换为YYYY-MM-DD字符串类型
         */
        'convertDateString': function(timestamp){
            var date = new Date(timestamp);
            var month, day;
            if(timestamp){
                month = date.getMonth() + 1;
                day = date.getDate();
                month = month > 10 ? month : ('0' + month);
                day = day >= 10 ? day : ('0' + day);
                return date.getFullYear() + '-' + month + '-' + day;
            }else{
                return null;
            }
        },
        
        /**
         * 将YYYY-MM-DD类型的日期转换为Date对象，注意不能直接使用new Date('YYYY-MM-DD')，IE8下会有兼容性问题
         */
        'dateString2Date': function(dateStr){
            var array = dateStr.split('-');
            return new Date(parseInt(array[0]), parseInt(array[1]) - 1, parseInt(array[2]));
        },

        /**
         * 根据urlKey与参数对象，生成url字符串
         * @param urlKey
         * @param urlParam 参数对象
         */
        genUrl: function(urlKey, urlParam) {
            var url = urlKey;
            if (util.isPlainObject(urlParam)) {
                url += (url.lastIndexOf('?') === -1) ? '?' : '&';
                url += QueryString.stringify(urlParam);
            }
            return url;
        },

        /**
         * 日期处理，将毫秒日期转换为年月日的对象，可以在渲染引擎中用
         * @param ms 日期的毫秒数
         * @returns {{year: string, month: string, date: string}}
         */
        parseDate: function(ms) {
            if (typeof ms === 'string') {
                ms = parseInt(ms, 10);
            }

            var dateObj = new Date(ms),
                year    = dateObj.getFullYear(),
                month   = dateObj.getMonth() + 1,
                date    = dateObj.getDate();

            return {
                year:  year + '',
                month: ( month < 10 ? '0' : '' ) + month,
                date:  ( date  < 10 ? '0' : '' ) + date
            };

        },

        /**
         * 控制台记录日志
         * @param msg 日志内容
         */
        log: function(msg) {
            if (console && typeof console.log === 'function') {
                console.log(msg);
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