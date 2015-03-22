/**
 * 接口处理模块
 */

KISSY.add(function(S, require, exports, module){

    //获取代码运行的环境（prod生产环境，mock为demo开发环境）
    var env=document.body && document.body.hasAttribute('env') ?
        document.body.getAttribute('env') : 'prod';
    
    var urls={
        'prod': {
            //sample
            'ajaxUrl': '/ajax/ajaxUrl.do'
        },
        'mock': {
            //sample
            'ajaxUrl': '/demo/mock/ajaxUrl.json'
        }
    };

    module.exports = urls[env];

});