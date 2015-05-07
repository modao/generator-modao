/**
 * xtemplate模板命令
 * xtemplate commands
 */
define(function(require, exports) {
    'use strict';

    var CommonUtil = require('./util');

    exports.genUrl = function(data, options) {
        if (!options.params || !options.params.length) {
            CommonUtil.error('args error on genUrl tplCommand');
        }

        return CommonUtil.genUrl.apply(CommonUtil, options.params);
    };


    exports.formatDate = function(data, options) {
        if (!options.params || !options.params.length) {
            CommonUtil.error('arg error on formatDate tplCommand');
        }

        var result = CommonUtil.parseDate(options.params[0]);

        return result.year + '年' +
               result.month + '月' +
               result.date  + '日';
    };

});
