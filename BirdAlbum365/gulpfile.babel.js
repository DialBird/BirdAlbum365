
const gulp = require('gulp');

const requireDir = require('require-dir');
requireDir('./gulp/tasks', {recurse: true});

const config = require('./gulp/config');

gulp.task('watch', ()=>{
    gulp.watch(config.js.srcDir + '/**/*.es6', ['compileJS']);
    gulp.watch(config.css.srcDir + '/**/*.sass',['compileCSS']);
});

gulp.task('default', ['compileJS', 'compileCSS', 'watch']);



//'use strict'
//
//var gulp = require('gulp'),
//    path = require('path'),
//    rename = require('gulp-rename'),
//    print = require('gulp-print'),
//    concat = require('gulp-concat'),
//    uglify = require('gulp-uglify'),
//    sass = require('gulp-sass'),
//    cleanCSS = require('gulp-clean-css'),
//    csscomb = require('gulp-csscomb'),
//    autoprefixer = require('gulp-autoprefixer'),
//    imagemin = require('gulp-imagemin'),
//    imageResize = require('gulp-image-resize-ar'),
//    plumber = require('gulp-plumber'),
//    notify = require('gulp-notify'),
//    hepburn = require('hepburn'),
//    audiosprite = require('gulp-audiosprite'),
//    spritesmith = require('gulp.spritesmith');
//
//
////------------------------------------------------------------------------------------------------------------
////PATH宣言
////------------------------------------------------------------------------------------------------------------
//
//var page1_src = 'public/src/page1';
//var page1_dist = 'public/build/page1';
//var page2_src = 'public/src/page2';
//var page2_dist = 'public/build/page2';
//var birdImg_src = 'public/src/birdImages/';
//var birdImg_dist = 'public/build/birdImages';
//var birdSound_src = 'public/src/birdSounds';
//var birdSound_dist = 'public/build/birdSounds';
//
//
////------------------------------------------------------------------------------------------------------------
////タスク
////------------------------------------------------------------------------------------------------------------
//
//
////------------------------------------------------------
////page1のコンパイル
////------------------------------------------------------
//
////js
//gulp.task('firstJS',function(){
//    gulp.src([
//        path.join(page1_src,'js/namespace.js'),
//        path.join(page1_src,'js/class.js'),
//        path.join(page1_src,'js/preloadData.js'),
//        path.join(page1_src,'js/init.js'),
//        path.join(page1_src,'js/main.js')
//    ])
//        .pipe(plumber({
//            errorHandler: notify.onError("Error: <%= error.message %>")
//        }))
//        .pipe(concat('page1.js'))
//        .pipe(gulp.dest(path.join(page1_dist,'js')))
//        .pipe(uglify())
//        .pipe(rename('page1.min.js'))
//        .pipe(gulp.dest(path.join(page1_dist,'js')));
//});
//
////css
////gulp.task('firstCSS',function(){
////    gulp.src(path.join(page1_src,'/sass/*.scss'))
////        .pipe(plumber({
////            errorHandler: function(err) {
////                console.log(err.messageFormatted);
////                this.emit('end');
////            }
////        }))
////        .pipe(sass({
////            includePaths: require('node-reset-scss').includePath,
////            outputStyle: 'expanded'
////        }))
////        .pipe(autoprefixer())
////        .pipe(csscomb())
////        .pipe(gulp.dest(path.join(page1_dist,'/css')))
////        .pipe(cleanCSS({compatibility: 'ie8'}))
////        .pipe(rename('master.min.css'))
////        .pipe(gulp.dest(path.join(page1_dist,'/css')))
////});
//gulp.task('firstCSS',function(){
//    gulp.src(path.join(page1_src,'/sass/*.scss'))
//        .pipe(plumber({
//            errorHandler: function(err) {
//                console.log(err.messageFormatted);
//                this.emit('end');
//            }
//        }))
//        .pipe(sass({
//            includePaths: require('node-reset-scss').includePath,
//            outputStyle: 'expanded'
//        }))
//        .pipe(autoprefixer())
//        .pipe(csscomb())
//        .pipe(gulp.dest(path.join(page1_dist,'/css')))
//        .pipe(cleanCSS({compatibility: 'ie8'}))
//        .pipe(rename('master.min.css'))
//        .pipe(gulp.dest(path.join(page1_dist,'/css')))
//});
//
////img
//gulp.task('webImagemin',function(){
//    gulp.src(path.join(page1_src,'img/*.jpg'))
//        .pipe(imagemin())
//        .pipe(gulp.dest(path.join(page1_dist,'img')));
//});
//
////------------------------------------------------------
////page2のコンパイル
////------------------------------------------------------
//
////js
//gulp.task('secondJS',function(){
//    gulp.src([
//            path.join(page2_src,'js/namespace.js'),
//            path.join(page2_src,'js/socketJoin.js'),
//            path.join(page2_src,'js/class.js'),
//            path.join(page2_src,'js/preloadData.js'),
//            path.join(page2_src,'js/init.js'),
//            path.join(page2_src,'js/main.js')
//        ])
//        .pipe(plumber({
//            errorHandler: function(err) {
//                console.log(err.messageFormatted);
//                this.emit('end');
//            }
//        }))
//        .pipe(concat('page2.js'))
//        .pipe(gulp.dest(path.join(page2_dist,'js')))
//        .pipe(uglify())
//        .pipe(rename('page2.min.js'))
//        .pipe(gulp.dest(path.join(page2_dist,'js')));
//});
//
////css
//gulp.task('secondCSS',function(){
//    compileSass('PC');
//    compileSass('SM');
//    function compileSass(_device){
//        gulp.src(path.join(page2_src,'sass/',_device,'/*.scss'))
//            .pipe(plumber({
//            errorHandler: function(err) {
//                console.log(err.messageFormatted);
//                this.emit('end');
//            }
//        }))
//            .pipe(sass({
//            includePaths: require('node-reset-scss').includePath,
//            outputStyle: 'expanded'
//        }))
//            .pipe(autoprefixer())
//            .pipe(csscomb())
//            .pipe(gulp.dest(path.join(page2_dist,'/css',_device)))
//            .pipe(cleanCSS({compatibility: 'ie8'}))
//            .pipe(rename('master.min.css'))
//            .pipe(gulp.dest(path.join(page2_dist,'/css',_device)));
//    };
//});
//
//
////------------------------------------------------------
////imageの圧縮、マニフェスト作り
////------------------------------------------------------
//
///*
//共通で使う鳥の画像を変形して圧縮する
//*/
//
//gulp.task('birdImageResize',function(){
//    imageResizeFunc('summerBirds');
//    imageResizeFunc('winterBirds');
//    imageResizeFunc('residentBirds');
//    imageResizeFunc('journeyBirds');
//    function imageResizeFunc(_folderName){
//        gulp.src(path.join(birdImg_src,'birdsOrigin',_folderName,'*.jpg'))
//            .pipe(imageResize({
//            width: 450,
//            height: 300,
//            crop: true,
//            upscale: false,
//            gravity: 'Center',
//            imageMagick: true,
//            }))
//            .pipe(imagemin())
//            .pipe(gulp.dest(path.join(birdImg_dist,'birdsResized',_folderName)));
//    };
//});
//
//gulp.task('birdSprite',function(){
//    gulp.src(path.join(birdImg_dist,'birdsDistorted/**/*.jpg'))
//        .pipe(spritesmith({
//            imgName: 'sprite.png',
//            cssName: 'sprite.json',
//            padding:10
//        }))
//        .pipe(gulp.dest(birdImg_dist));
//});
//gulp.task('envSprite',function(){
//    createSprite('spring');
//    createSprite('summer');
//    createSprite('fall');
//    createSprite('winter');
//    function createSprite(_season){
//        gulp.src(path.join('public/img/'+_season+'Env/*.png'))
//            .pipe(spritesmith({
//            imgName: _season+'Sprite.png',
//            cssName: _season+'Sprite.json',
//            padding:10
//        }))
//            .pipe(gulp.dest('public/img/'+_season+'Env'));
//    };
//});
//
///*
//・鳥画像をプリロードするためのマニフェスト
//・プリロードした画像や、オーディオスプライト、データベースから鳥の情報を引っ張ってくるのに必要な鳥の名前（ローマ字）を季節ごとに格納したもの
//・データベースオブジェクト（日本語名を格納）
//を作成する
//*/
//
//gulp.task('createManifest',function(){
//    //画像をpreloadするときのマニフェスト
//    var loadManifest = [];
//    //preloadした画像や、鳥の音声、日本語名を引っ張ってくるのに必要な鳥の名前（key）をジャンルに分けて格納しておく
//    var birdNames = {
//        summer: [],
//        winter: [],
//        journey: [],
//        resident: [],
//    };
//    //鳥情報のデータベース（日本語名は自分で打つ）
//    var databaseManifest = {};
//    gulp.src(path.join(birdImg_dist,'birdsDistorted/**/*.jpg'))
//        .pipe(print(function(filepath){
//            filepath.match(/(\/build.+Birds\/(.*?).jpg)/);
//            //プリロード用のマニフェストの配列に格納
//            loadManifest.push({id: RegExp.$2, src: RegExp.$1});
//            //ディレクトリによって、特定の配列に振り分けて格納する
//            devideBirdsInto(RegExp.$1,RegExp.$2);
//            //日本語名を引き出すための連想配列の雛形作成（日本語名は自分で打つ）
//            databaseManifest[RegExp.$2] = {JPName: hepburn.toKatakana(RegExp.$2)};
//        })).on('end',function(){
//        //どれかをオンにして出力
////            console.log(loadManifest);
////            console.log(birdNames);
//            console.log(databaseManifest);
//        });
//    function devideBirdsInto(_address,_name){
//        if(_address.indexOf('summer') >= 0){
//            birdNames.summer.push(_name);
//        }else if(_address.indexOf('winter') >= 0){
//            birdNames.winter.push(_name);
//        }else if(_address.indexOf('journey') >= 0){
//            birdNames.journey.push(_name);
//        }else if(_address.indexOf('resident') >= 0){
//            birdNames.resident.push(_name);
//        }
//    }
//});
//
//
////------------------------------------------------------
////imageの圧縮、マニフェスト作り
////------------------------------------------------------
//gulp.task('audiosprite',function(){
//    gulp.src(path.join(birdSound_src,'/*.mp3'))
//        .pipe(audiosprite({
//            output: 'birdSoundsSprite',
//            export: 'ogg',
//            format: 'createjs'
//        }))
//        .pipe(gulp.dest(path.join(birdSound_dist)));
//});
//gulp.task('audiosprite2',function(){
//    gulp.src(path.join(birdSound_src,'/*.mp3'))
//        .pipe(audiosprite({
//            output: 'birdSoundsSprite2',
//            export: 'ogg',
//            format: 'createjs',
//            bitrate: '64'
//        }))
//        .pipe(gulp.dest(path.join(birdSound_dist)));
//});
//
//
//gulp.task('json',function(){
//    gulp.src(path.join('routes/database.js'))
//        .pipe(print());
//});
//
//
////------------------------------------------------------
////監視
////------------------------------------------------------
////------------------------------------------------------
////コンパイルのwatch
////------------------------------------------------------
//
////新しいバージョンJSコンパイル
//gulp.task('watch',function(){
//    //sassのフォルダ以下のsassをすべて監視
//    gulp.watch(path.join(page1_src,'/sass/**/*.scss'),['firstCSS']);
//    gulp.watch(path.join(page1_src,'/js/*.js'),['firstJS']);
//    gulp.watch(path.join(page2_src,'/sass/**/*.scss'),['secondCSS']);
//    gulp.watch(path.join(page2_src,'/js/*.js'),['secondJS']);
//});
//
//gulp.task('default',['firstCSS','firstJS','secondCSS','secondJS','watch']);








