/**
 * 样例页面：页面入口js模块
 */

define(function(require, exports, module){
    
    'use strict';
    //引入widget中相应模块
    var Mod = require('./mod/mod');
    
    new Mod().init();
    
    
});