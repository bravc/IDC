const express = require('express');
const router = express.Router();


router.get('/login', function(req, res) {
	//render login page
	res.render('login');
});


router.post('/login', function(req, res) {

});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('sucess', 'You are logged out');
	res.redirect('/');
});

module.exports = router;