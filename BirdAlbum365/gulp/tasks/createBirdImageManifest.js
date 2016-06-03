
//const gulp = require('gulp');
//const print = require('gulp-print');
//const hepburn = require('hepburn');
//
//const config = require('../config');
//
//gulp.task('createBirdImageManifest', ()=>{
//    //画像をpreloadするときのマニフェスト
//    let loadManifest = [];
//    //preloadした画像や、鳥の音声、日本語名を引っ張ってくるのに必要な鳥の名前（key）をジャンルに分けて格納しておく
//    let birdNames = {
//        summer: [],
//        winter: [],
//        journey: [],
//        resident: [],
//    };
//    //鳥情報のデータベース（日本語名は自分で打つ）
//    let databaseManifest = {};
////    gulp.src(path.join(birdImg_dist,'birdsDistorted/**/*.jpg'))
//    gulp.src(config.img + '/birdsDistorted/**/*.jpg')
//        .pipe(print((filepath)=>{
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