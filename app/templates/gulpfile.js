/**
 * gulpfile.js
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var kmc = require('gulp-kmc');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var config = require('./package.json');

var XTemplate = require('xtemplate'),
    XTemplateVer = require('xtemplate/package.json').version,
    gulpXTemplate = require('gulp-xtemplate');

var src = "./src/";
var dest = "./build/";

var fs = require('fs'),
    subDirLists;

function getSubDirName(path){
    var globs = fs.readdirSync(path);
    var dirList=[];
    globs.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            dirList.push(item);
        }
    });
    return dirList;
}

//遍历pages目录
subDirLists=getSubDirName(src+'pages');
console.log('查询到pages目录下包含的目录有：'+subDirLists.join(';'));
//注意config里面的name字段被用作kissy包名
kmc.config({
    packages: [
        {
            name: config.name,
            base: src
        }
    ]
});


gulp.task('copy', function(){
    gulp.src(src+'iconfont/**/*')
        .pipe(gulp.dest(dest+'iconfont/'));
    gulp.src(src+'webfont/**/*')
        .pipe(gulp.dest(dest+'webfont/'));
});

gulp.task('xtpl', function() {
    return gulp.src(src + '**/*.xtpl')
        .pipe(gulpXTemplate({
            wrap: 'kissy',
            runtime: 'kg/xtemplate/' + XTemplateVer + '/runtime',
            XTemplate: XTemplate
        }))
        .pipe(gulp.dest(src));
});

gulp.task('kmc', function (done) {
    var taskLen = subDirLists.length;

    function callDone() {
        taskLen -= 1;
        if (taskLen === 0) {
            done();
        }
    }

    subDirLists.forEach(function(subDir){
        gulp.src([src+'pages/'+subDir+'/**/*.js', src+'widget/**/*.js'])
            .pipe(kmc.convert({
                kissy: true,
                exclude: [],
                requireCss: false,
                ignoreFiles: []
            }))
            .pipe(concat(subDir+'.js'))
            .pipe(gulp.dest(dest))
            .on('end', callDone);
    });

});

gulp.task('uglifyJs', ['kmc'], function(){
    return gulp.src([dest+'**/*.js', '!'+dest+'**/*-min.js'])
        .pipe(rename(function(path){
            path.basename+='-min';
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('css', function () {
    subDirLists.forEach(function(subDir){
        gulp.src([src+'pages/'+subDir+'/**/*.less', src+'widget/**/*.less'])
            .pipe(less())
            .pipe(concatCss(subDir+'.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest(dest));
    });
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.xtpl', ['xtpl']);
    gulp.watch('./src/**/*.less', ['css']);
});

gulp.task('default', ['copy', 'xtpl', 'kmc', 'uglifyJs', 'css']);
