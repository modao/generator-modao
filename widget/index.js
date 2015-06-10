/**
 * sub-generators widget(新建一个widget目录的组件)
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
     * 复制文件
     * @private
     */
    _copy: function(srcPath, destPath){
        this.fs.copy(
            this.templatePath(srcPath),
            this.destinationPath(destPath)
        );
    },
    /**
     * 渲染模板并拷贝文件
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
     * 递归复制一个文件夹下面的所有文件到DestinationPath
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
