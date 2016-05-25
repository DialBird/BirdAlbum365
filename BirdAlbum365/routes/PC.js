'use strict';


var express = require('express');
var router = express.Router();

/*
*PCが入ってきたら入れて、それ以外(スマホタブレット)ならば弾く
*/
router.get('/', function(req, res, next) {
    /*
        ランダムにroomIDを作成する
    */
    var roomID = (function(){
        var id = '';
        var letters = ['a','b','c','d'];
        var i,len = letters.length
        for(i=0;i<len;i++){
            id += letters[Math.floor(Math.random()*letters.length)];    //アルファベットを適当に配列
        }
        id += Math.ceil(Math.random()*1024);            //1から1024までの数字を適当に追加
        return id;
//        return 1;
    }());
    console.log('your ID is '+ roomID);
    res.render('main_for_PC',{
        roomID: roomID,
        test: 'yey'
    });
});

module.exports = router;
