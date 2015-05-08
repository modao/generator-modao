'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
        //用户填写的项目相关的信息
        this.project={};
    },
    
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the dazzling ' + chalk.red('Modao') + ' generator! Gathering information to set up projects!'
        ));

        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'project name ? '+ chalk.red('Note:') + 'this name will be used as kissy config pkg name',
            default: (this.appname)
        }, {
            type: 'input',
            name: 'description',
            message: 'project description?',
            default: 'My Project'
        }, {
            type: 'input',
            name: 'gitUrl',
            message: 'project gitlab url?',
            store: true
        }, {
            type: 'input',
            name: 'keywords',
            message: 'project keywords?(use comma to seperate words)',
            default: 'kissy,gulp'
        }, {
            type: 'input',
            name: 'author',
            message: 'project author?',
            store: true
        }];

        //.bind(this)是将this作用域保证指向generator
        this.prompt(prompts, function (answers) {
            this.project.name=answers.name;
            //将name存入generator.storage中，供sub-generator调用
            this.config.set('pkgName', answers.name);
            this.project.description=answers.description;
            this.project.gitUrl=answers.gitUrl;
            this.project.keywords=answers.keywords;
            this.project.author=answers.author;
            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.project.keywords=this._convertKeywords(this.project.keywords);
            this._template('_package.json', 'package.json', this.project);
            this._copy('_bower.json', 'bower.json');
            this._copy('README.md', 'README.md');
            this._copy('_.gitignore', '.gitignore');
        },
        projectfiles: function() {
            this._copy('editorconfig', '.editorconfig');
            this._copy('jshintrc', '.jshintrc');
            this._copy('jshint-reporter.js', 'jshint-reporter.js');
        },
        gulp: function(){
            this._copy('gulpfile.js', 'gulpfile.js');
        },
        font: function(){
            this._copyDir('src/iconfont');
            this._copyDir('src/webfont');
        },
        widget: function(){
            this._copyDir('src/widget');
        },
        less: function(){
            this._copyDir('src/less');
        },
        demo: function(){
            this._copyDir('demo/mock');
        }
    },

    install: function () {
//        this.installDependencies({
//            skipInstall: this.options['skip-install']
//        });
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
    '_copyDir': function(path){
        var _this=this;
        var files=fs.readdirSync(_this.templatePath(path));
        files.forEach(function(item){
            var newPath=path+'/'+item;
            if(fs.statSync(_this.templatePath(newPath)).isDirectory()){
                _this._copyDir(newPath);
            }
            if(fs.statSync(_this.templatePath(newPath)).isFile()){
                _this._copy(newPath, newPath);
            }
        });
    },
    /**
     * keyword字段格式转换(kissy,gulp -> "kissy","gulp")
     * @private
     */
    _convertKeywords: function(keywords){
        var arr=keywords.split(',');
        arr.forEach(function(keyword, index, array){
            array[index]='"'+keyword+'"';
        });
        return arr.join(',');
    }
});
