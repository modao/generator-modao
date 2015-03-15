/**
 * gulpfile.js
 */

var gulp = require('gulp');
var through = require('through2');
var rename = require('gulp-rename');
var kmc = require('gulp-kmc');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var config = require('./package.json');
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

gulp.task('kmc', function () {
    subDirLists.forEach(function(subDir){
        gulp.src([src+'pages/'+subDir+'/**/*.js', src+'widget/**/*.js'])
            .pipe(kmc.convert({
                kissy: true,
                exclude: [],
                requireCss: false,
                ignoreFiles: []
            }))
            .pipe(concat(subDir+'.js'))
            .pipe(gulp.dest(dest));
    });

});

gulp.task('uglifyJs', function(){
    gulp.src([dest+'**/*.js', '!'+dest+'**/*-min.js'])
        .pipe(rename(function(path){
            path.basename+='-min';
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('less2css', function(){
    gulp.src(src+'**/*.less')
        .pipe(less())
        .pipe(gulp.dest(src));
});

gulp.task('css', ['less2css'], function () {
    subDirLists.forEach(function(subDir){
        gulp.src([src+'pages/'+subDir+'/**/*.less', src+'widget/**/*.less'])
            .pipe(less())
            .pipe(concatCss(subDir+'.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest(dest))
    });
});


gulp.task('default', ['copy', 'kmc', 'uglifyJs', 'less2css', 'css']);
