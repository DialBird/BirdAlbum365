

const express = require('express');
const router = express.Router();

//PCで最初に表示する画面を表示
router.get('/', function(req, res, next) {
	const ua = req.headers['user-agent'];
	//スマホだった場合はPCで入る旨を伝えるページへ飛ばす
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
		res.render('loginError', {});
	//タブレットでもダメ
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		res.render('loginError', {});
	} else {
		res.render('introPage', {});
	}
});


//PCでメインページに入ったとき
router.get('/mainPageForPC', (req, res)=>{
	const ua = req.headers['user-agent'];
	//スマホだった場合はPCで入る旨を伝えるページへ飛ばす
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
		res.render('loginError', {});
	//タブレットでもダメ
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		res.render('loginError', {});
	} else {
		//ランダムにroomIDを作成する
		const roomID = (()=>{
			const letters = ['a','b','c','d'];
			const len = letters.length;
			let id = '';
			let i;
			for (i=0;i<len;i++){
				id += letters[Math.floor(Math.random()*letters.length)];    //アルファベットを適当に配列
			}
			id += Math.ceil(Math.random()*1024);            //1から1024までの数字を適当に追加
			return id;
	//        return 1;
		})();
		res.render('mainPageForPC', {roomID : roomID});
	}
});

//SMでメインページに入ったとき
router.get('/mainPageForSM', (req, res)=>{
    const roomID = req.query.id;
    res.render('mainPageForSM', {roomID : roomID});
});




module.exports = router;
