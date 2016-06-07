   
const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
	const ua = req.headers['user-agent'];
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
	//	res.render('indexForSP', {});
		res.send('yey');
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		res.render('indexForSP', {});
	} else {
		res.render('indexForPC', {});
	}
});

module.exports = router;
