const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: '../uploads'})
const cloudinary = require('cloudinary');

//Cloudinary config
const CLOUD_NAME = 'dkoaky7gl';
const API_KEY = 398486879149374;
const API_SECRET = '-Rp3hPd5uOoevk5Pd7UT5f77dIw';
cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: API_SECRET
});


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
	req.flash('success', 'You have successfully logged out');
	res.redirect('/');
});


//Render profile pages
router.get('/profile/:id', ensureAuthenticated, function(req, res){
	//find user and redirect to their page
	let query = {_id:req.params.id}

	Users.findById(req.params.id, function(err, user){
			res.render('profile', {
			profile: user.name
		})
	});
});


//Handle User image submission
const type = upload.single('avatar');

router.post('/upload/:id', type, ensureAuthenticated, function(req, res, next){
	const tempPath = req.file.path;

	let query = {_id:req.params.id}

	Users.findById(req.params.id, function(err, user){
		if (user && user.id === req.user.id){
			cloudinary.v2.uploader.upload(tempPath, {public_id: 'user.id/profilePic'}, function(err, result){
				if(err){
					console.log(err);
					return;
				}else{
					//find user and save profile pic
					console.log(result);
					user.profilePic = result.url;
					user.save(function(err){
						if(err){
							console.log(err);
							return;
						}else{
							req.flash('success', 'Image successfully uploaded')
							res.redirect('/users/profile/' + user.id)
						}
					});
				}
			});
		}
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