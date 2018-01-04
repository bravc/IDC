const express = require('express');
const router = express.Router();


router.get('/login', function(req, res) {
	//render login page
	res.render('login');
});

module.exports = router;