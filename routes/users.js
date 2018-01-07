const express = require('express');
const router = express.Router();

let Users = require('../models/users');

//Render login page
router.get('/login', function(req, res) {
	//render login page
	res.render('login');
});


//Render local login system
router.post('/login', function(req, res) {

});


//Handle logout functionality
router.get('/logout', function(req, res){
	req.logout();
	req.flash('sucess', 'You are logged out');
	res.redirect('/');
});


//Render profile pages
router.get('/profile/:id', ensureAuthenticated, function(req, res){

	let query = {_id:req.params.id}

	Users.findById(req.params.id, function(err, user){
			res.render('profile', {
			profile: user.name
		})
	});
});



// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;