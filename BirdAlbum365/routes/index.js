'use strict';


var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var ua = req.headers['user-agent'];
    //スマホならばアクセスできない
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        res.send('Please Access with PC, NOT SmartPhone');
    //タブレットならばアクセスできない
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        res.send('Please Access with PC, NOT Tablet');
    //PCでならアクセスできる
    }else{
        console.log('enter');
        res.render('index');
    }
});









//
///*
//*PCが入ってきたら入れて、それ以外(スマホタブレット)ならば弾く
//*/
//router.get('/', function(req, res, next) {
//    var ua = req.headers['user-agent'];
//    //スマホならばアクセスできない
//    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
//        res.send('Please Access with PC, NOT SmartPhone');
//    //タブレットならばアクセスできない
//    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
//        res.send('Please Access with PC, NOT Tablet');
//    //PCでならアクセスできる
//    }else{
//        /*
//            ランダムにroomIDを作成する*/
//        var roomID = (function(){
//            //            var id = '';
//            //            var letters = ['a','b','c','d'];
//            //            for(i=0;i < letters.length;i++){
//            //                id += letters[Math.floor(Math.random()*letters.length)];    //アルファベットを適当に配列
//            //            }
//            //            id += Math.ceil(Math.random()*1024);            //1から1024までの数字を適当に追加
//            //            return id;
//            return 1;
//        }());
//        console.log('your ID is '+ roomID);
//        res.render('index_for_PC',{
//            roomID: roomID
//        });
//    }
//});

module.exports = router;
