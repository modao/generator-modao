/**
 * gulpfile
 */

var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var kmc = require('gulp-kmc');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var reporter = require('./jshint-reporter');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var clean = require('gulp-clean');
var sequence = require('run-sequence');
var through2 = require('through2');
var through  = require('through');

var config = require('./package.json');

var XTemplate = require('xtemplate'),
    XTemplateVer = '4.2.1',
    gulpXTemplate = require('gulp-xtemplate');

var dev  = './dev/', /* compile xtemplate */
    src  = './src/',
    dest = './build/';


/** helpers */
function sort() {
    var files = [];
    return through(function(file) {
        files.push(file);
    }, function() {
        files.sort(function(a, b) {
            return a.path.localeCompare(b.path);
        }).forEach((function(_this) {
            return function(file) {
                return _this.emit('data', file);
            };
        })(this));

        return this.emit('end');
    });
}

function check() {
    return through2.obj(function(file, enc, callback) {
        if (!file.contents.length) {
            throw new Error('gulp error on file: ' + file +
                ', please re-exec the build process');
        }
        this.push(file);
        callback();
    });
}

/* do not iterate pages dir dir by default */
var _subDirLists;

function getSubDirName() {
    if (!_subDirLists) {
        _subDirLists = [];

        var pagesDir = src + 'pages',
            globs = fs.readdirSync(pagesDir);

        globs.forEach(function(item){
            if (fs.statSync(pagesDir + '/' + item).isDirectory()) {
                _subDirLists.push(item);
            }
        });
        console.log('查询到pages目录下包含的目录有：' + _subDirLists.join('; '));
    }

    return _subDirLists.slice(0);
}

function eachSubDirLists(fn, done) {
    var subDirLists = getSubDirName();

    function execNext() {
        var curr = subDirLists.shift();
        if (curr) {
            fn(curr, execNext);
        } else {
            done();
        }
    }

    execNext();
}


/** jshint check */
gulp.task('jshint', function(){
    return gulp.src(src + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(reporter));
});

/** for develop */
gulp.task('kill-dev', function() {
    return gulp.src(dev, { read: false })
        .pipe(clean());
});

gulp.task('dev-copy-src', function() {
    return gulp.src( [
            src + '/**/*',
            '!' + src + '/**/*.less',
            '!' + src + '/**/*.xtpl'
    ])
        .pipe(gulp.dest(dev));
});


gulp.task('dev-copy-js', function() {
    return gulp.src( src + '/**/*.js' )
        .pipe(gulp.dest(dev));
});

gulp.task('dev-less', function() {
    return gulp.src(src + '/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(dev));
});

gulp.task('dev-xtpl', function() {
    return gulp.src(src + '**/*.xtpl')
        .pipe(through2.obj(function (file, encoding, callback) {
            if (file.isBuffer()) {
                var tmp = file.contents.toString();
                tmp = tmp.replace(/\r\n/g, '\n');
                file.contents = new Buffer(tmp);
            }
            this.push(file);
            callback();
        }))
        .pipe(gulpXTemplate({
            wrap: 'define',
            runtime: 'lib/xtemplate/'+ XTemplateVer +'/runtime',
            XTemplate: XTemplate
        }))
        .pipe(gulp.dest(dev));
});

gulp.task('dev-build', function(done) {
    sequence('kill-dev', [
        'dev-copy-src', 'dev-copy-js', 'dev-less', 'dev-xtpl'
    ], done);
});

gulp.task('dev-watch', [ 'dev-build' ], function() {
    gulp.watch(src + '/**/*.js',   [ 'dev-copy-js' ] );
    gulp.watch(src + '/**/*.less', [ 'dev-less' ] );
    gulp.watch(src + '/**/*.xtpl', [ 'dev-xtpl' ] );
});

gulp.task('dev', [ 'dev-build', 'dev-watch' ] );


/** for production */
gulp.task('kill-build', function() {
    return gulp.src(dest, { read: false })
        .pipe(clean());
});


gulp.task('copy-iconfont', ['dev-copy-src'], function(){
    return gulp.src([
            dev + '/iconfont/**/*'
    ])
        .pipe(gulp.dest(dest + '/iconfont'));

});

gulp.task('copy-webfont', ['dev-copy-src'], function(){
    return gulp.src([
            dev + '/webfont/**/*'
    ])
        .pipe(gulp.dest(dest + '/webfont'));

});

gulp.task('kmc', ['dev-copy-js', 'dev-xtpl'], function (done) {
    kmc.config({
        packages: [
            {
                name: config.name,
                base: dev
            }
        ]
    });

    eachSubDirLists(function(subDir, end) {
        gulp.src([
                dev + 'pages/' + subDir + '/**/*.js',
                dev + 'widget/**/*.js'
        ])
            .pipe(sort())
            .pipe(check())
            .pipe(kmc.convert({
                define:       true,
                exclude:     [],
                requireCss:  false,
                ignoreFiles: []
            }))
            .pipe(concat(subDir + '-debug.js'))
            .pipe(gulp.dest(dest))
            .on('end', end);
    }, done);
});


gulp.task('uglifyJs', [ 'kmc' ], function() {
    return gulp.src([
            dest + '**/*-debug.js'
    ])
        .pipe(rename(function(path){
            path.basename =
                path.basename.substr(0, path.basename.length -6);
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

gulp.task('parseUtf8', [ 'uglifyJs' ], function() {
    gulp.src(dest + '**/*.js')
        .pipe(through2.obj(function (file, encoding, callback) {
            if (file.isBuffer()) {
                var tmp = file.contents.toString();
                tmp = tmp.replace(/[^\u0000-\u00FF]/g, function ($0) {
                    return global.escape($0).replace(/(%u)(\w{4})/gi, '\\u$2');
                });
                file.contents = new Buffer(tmp);
            }
            this.push(file);
            callback();
        }))
        .pipe(gulp.dest(dest));
});



gulp.task('iconfont-css', [ 'dev-less' ], function() {
    return gulp.src([
            dev + 'iconfont/iconfont.css'
    ])
        .pipe(rename(function(path){
            path.basename += '-debug';
        }))
        .pipe(gulp.dest(dest + 'iconfont/'));
});

gulp.task('webfont-css', [ 'dev-less' ], function() {
    return gulp.src([
            dev + 'webfont/webfont.css'
    ])
        .pipe(rename(function(path){
            path.basename += '-debug';
        }))
        .pipe(gulp.dest(dest + 'webfont/'));
});

gulp.task('css', [ 'dev-less' , 'iconfont-css', 'webfont-css'], function (done) {
    eachSubDirLists(function(subDir, end) {
        gulp.src([
                dev + 'pages/' + subDir + '/**/*.css',
                dev + 'widget/**/*.css'
        ])
            .pipe(sort())
            .pipe(check())
            .pipe(concatCss(subDir + '-debug.css'))
            .pipe(gulp.dest(dest))
            .on('end', end);
    }, done);
});

gulp.task('minifyCss', [ 'css', 'copy-iconfont', 'copy-webfont' ], function() {
    return gulp.src([
            dest + '**/*-debug.css'
    ])
        .pipe(rename(function(path){
            path.basename =
                path.basename.substr(0, path.basename.length -6);
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest(dest));
});

gulp.task('build', function(done) {
    sequence(
        [ 'kill-dev', 'kill-build'],

        [
            'copy-iconfont', 'copy-webfont',
            'jshint', 'kmc', 'uglifyJs', 'parseUtf8',
            'css', 'minifyCss'
        ],
        done
    );
});

gulp.task('clean',   [ 'kill-dev' ] );
gulp.task('default', [ 'build' ]);
