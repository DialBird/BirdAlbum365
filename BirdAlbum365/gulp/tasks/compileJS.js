
const gulp = require('gulp');
const path = require('path');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const webpack = require('gulp-webpack');

const config = require('../config');

gulp.task('compileJS', ()=>{
    gulp.src(config.js.srcDir)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(webpack(config.webpack))
        .pipe(gulpif(config.js.uglify, uglify()))
        .pipe(gulp.dest(config.js.bldDir));
});

//gulp.task('compileJS', ()=>{
//    gulp.src([
//        path.join(config.js.srcDir,'/namespace.js'),
//        path.join(config.js.srcDir,'/class.js'),
//        path.join(config.js.srcDir,'/preloadData.js'),
//        path.join(config.js.srcDir,'/init.js'),
//        path.join(config.js.srcDir,'/main.js')
//    ])
//        .pipe(plumber({
//            errorHandler: notify.onError("Error: <%= error.message %>")
//        }))
//        .pipe(concat('page1.js'))
//        .pipe(gulp.dest(path.join(config.js.bldDir,'js')));
//});