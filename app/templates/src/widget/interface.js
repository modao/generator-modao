/**
 * 接口处理模块
 */

define(function(require, exports, module){

    'use strict';
    var ErrorHandle = require('./error');

    var DEFAULT_ENV = 'prod';
    var AJAX_TYPES = {
        prod: 'post',
        daily: 'post',
        local: 'get'
    };
    var DATA_TYPES = {
        prod: 'json',
        daily: 'json',
        local: 'json'
    };

    var URLS={
        prod: {
            //sample
            ajaxUrl: '//server/ajax/ajaxUrl.do'
        },
        daily: {
            //sample
            ajaxUrl: '//server/ajax/ajaxUrl.do'
        },
        local: {
            //sample
            ajaxUrl: '/demo/mock/ajaxUrl.json'
        }
    };

    /**
     * 获取当前ENV
     */
    function getEnv() {
        var body = document.body;

        /* return if there is any specific env on body tag */
        return body && body.hasAttribute('env') ?
            body.getAttribute('env') :
            DEFAULT_ENV; /* otherwise return the default env */
    }

    /**
     * 根据当前env获取相应请求url
     * @param name IO请求对应的名称字符串
     */
    function getUrl(name){
        var env = getEnv();
        if(!URLS[env]){
            ErrorHandle.handleError('Not found URLS in current env!');
            env = DEFAULT_ENV;
        }else if(!URLS[env][name]){
            ErrorHandle.handleError('Not found urlName in current env URLS!');
        }
        return URLS[env][name];
    }

    /**
     * 根据当前env获取请求类型
     */
    function getAjaxType(){
        var env = getEnv();
        if(!AJAX_TYPES[env]){
            ErrorHandle.handleError('Not found AJAX_TYPES in current env!');
            env = DEFAULT_ENV;
        }
        return AJAX_TYPES[env];
    }

    /**
     * 根据当前env获取返回数据类型
     * @returns {*}
     */
    function getDataType(){
        var env = getEnv();
        if(!DATA_TYPES[env]){
            ErrorHandle.handleError('Not found DATA_TYPES in current env!');
            env = DEFAULT_ENV;
        }
        return DATA_TYPES[env];
    }

    module.exports.getUrl = getUrl;
    module.exports.getEnv = getEnv;
    module.exports.getAjaxType = getAjaxType;
    module.exports.getDataType = getDataType;

});
