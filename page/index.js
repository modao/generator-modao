/* 
 * sub-generators page
 * yo generator-modao:page name
 */

'use strict';
var yeoman = require('yeoman-generator');
var fs = require('fs');

module.exports = yeoman.generators.NamedBase.extend({
    initializing: function () {
        this.pageName=this.name;
        //用户填写的项目相关的信息
        this.project={};
    },

    writing: {
        page: function(){
            var _this=this;
            this._template('demo/sample.html', 'demo/'+this.pageName+'.html', {
                pageName: _this.pageName,
                pkgName: _this.config.get('pkgName')
            });
            this._copy('src/pages/sample/index.js', 'src/pages/'+this.pageName+'/index.js');
            this._copy('src/pages/sample/index.less', 'src/pages/'+this.pageName+'/index.less');
            this._copyDir('src/pages/sample/mod', 'src/pages/'+this.pageName+'/mod');
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
