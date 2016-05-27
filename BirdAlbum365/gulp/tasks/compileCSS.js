
const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const sass = require('gulp-sass');

const config = require('../config');

//フォルダ下のsassファイルを名前をそのままでコンパイル

gulp.task('compileCSS', ()=>{
    gulp.src(config.scc.srcDir)
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sass({
            includePaths: require('node-reset-scss').includePath,
            outputStyle: 'expanded'
        }))
        .pipe(autoprefixer())
        .pipe(csscomb())
        .pipe(gulp.dest(config.css.bldDir));
//        .pipe(cleanCSS({compatibility: 'ie8'}))
//        .pipe(gulp.dest(path.join(page1_dist,'/css')))
});