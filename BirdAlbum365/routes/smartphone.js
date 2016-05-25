var express = require('express');
var router = express.Router();

/*
*URLからroomIDを取得し、スマホページにroomIDをレンダーする
*/
router.get('/', function(req, res, next) {
    var roomID = req.query.id;
    res.render('main_for_SM',{
        roomID : roomID
    });
});

module.exports = router;