/**
 * sub-generators widget(�½�һ��widgetĿ¼�����)
 * yo generator-modao:widget name
 */

'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');

module.exports = yeoman.generators.NamedBase.extend({
    initializing: function () {
        this.widgetName = this.name;
    },

    writing: {
        widget: function(){
            var _this=this;
            this._copy('src/widget/index.js', 'src/widget/'+ _this.widgetName+'/index.js');
            this._copy('src/widget/index.less', 'src/widget/'+_this.widgetName+'/index.less');
        }
    },
    /**
     * �����ļ�
     * @private
     */
    _copy: function(srcPath, destPath){
        this.fs.copy(
            this.templatePath(srcPath),
            this.destinationPath(destPath)
        );
    },
    /**
     * ��Ⱦģ�岢�����ļ�
     * @private
     */
    _template: function(srcPath, destPath, data){
        this.fs.copyTpl(
            this.templatePath(srcPath),
            this.destinationPath(destPath),
            data
        );
    },
    /**
     * �ݹ鸴��һ���ļ�������������ļ���DestinationPath
     */
    '_copyDir': function(path, destPath){
        var _this=this;
        var files=fs.readdirSync(_this.templatePath(path));
        files.forEach(function(item){
            var newPath=path+'/'+item;
            var newDestPath=destPath+'/'+item;
            if(fs.statSync(_this.templatePath(newPath)).isDirectory()){
                _this._copyDir(newPath);
            }
            if(fs.statSync(_this.templatePath(newPath)).isFile()){
                _this._copy(newPath, newDestPath);
            }
        });
    }
});
