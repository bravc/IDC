const express = require('express');
const router = express.Router();

let Users = require('../models/users');

let Post = require('../models/post');

let date = new Date();

router.post('/new', ensureAuthenticated, function(req, res){
	req.checkBody('body', 'Body is required').notEmpty();

	let errors = req.validationErrors();

	console.log(errors);

	if (errors){
		req.flash('danger', "There's nothing wrtiten!");
		res.redirect('/');
	}else{
		let post = new Post();
		post.author = req.user;
		post.content = req.body.body;
		post.date = date.toLocaleDateString() + " at " + date.toLocaleTimeString();

		post.save(function(err){
			if(err){
				console.log(err);
				return;
			}else{
				req.user.posts.push(post._id);
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

router.post('/posts/like/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}

	console.log("got here");

	Post.findById(req.params.id, function(err, post){
		if (err){
			console.log(err);
		}else{
			post.likes = post.likes + 1;
		}
	});
});


router.delete('delete/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}

	Post.findById(req.params.id, function(err, post){
		if(post.author != req.user){
			req.flash('danger', "That's not yours!");
			res.redirect(req.url);
		}else{
			Post.remove(query, function(err){
				if(err){
					console.log(err);
				}else{
					req.flash('success', "Post deleted!");
					res.redirect(req.url);
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