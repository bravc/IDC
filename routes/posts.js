const express = require('express');
const router = express.Router();

let Users = require('../models/users');

let Post = require('../models/post');

let date = new Date();

router.post('/new', ensureAuthenticated, function(req, res){
	req.checkBody('body', 'Body is required').notEmpty();

	let errors = req.validationErrors();

	if (errors){
		res.render('main', {
			errors: errors
		});
	}else{
		let post = new Post();
		post.author = req.user;
		post.content = req.body.body;
		post.date = date.toDateString();

		post.save(function(err){
			if(err){
				console.log(err);
				return;
			}else{
				req.user.posts.push(post);
				req.user.save(function(err){
					if(err){
						console.log(err);
					}else{
						req.flash('success', 'Post added!');
						res.redirect('/');
					}
				});
			}
		});
	}

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