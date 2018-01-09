const express = require('express');
const router = express.Router();

let Users = require('../models/users');

let Post = require('../models/post');



router.post('/new', ensureAuthenticated, function(req, res){
	req.checkBody('body', 'Body is required').notEmpty();

	let errors = req.validationErrors();

	console.log(errors);

	if (errors){
		req.flash('danger', "There's nothing wrtiten!");
		res.redirect('/');
	}else{
		let date = new Date();
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

router.post('/like/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}

	console.log(req.params.id);

	Post.findById(req.params.id, function(err, post){
		if (err){
			res.status(500).send(err);
		}else{
			if (post.likes){
				post.likes = post.likes +1;
			}else{
				post.likes = 1;
			}
			post.save(function(err){
				if (err){
					console.log("couldnt save");
				}else{
					console.log("got here")
					res.send('Success');
				}
			});
		}
	}).populate('author');
});


router.post('/dislike/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}

	console.log(req.params.id);

	Post.findById(req.params.id, function(err, post){
		if (err){
			res.status(500).send(err);
		}else{
			if (post.dislikes){
				post.dislikes = post.dislikes +1;
			}else{
				post.dislikes = 1;
			}
			post.save(function(err){
				if (err){
					console.log("couldnt save");
				}else{
					console.log("got here")
					res.send('Success');
				}
			});
		}
	}).populate('author');
});



router.delete('/delete/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}
	Post.findById(req.params.id, function(err, post){
		if(!err){
			if(post.author != req.user._id){
				req.flash('danger', "That's not yours!");
				res.status(500).send();
			}else{
				Post.remove(query, function(err){
					if(err){
						console.log(err);
					}else{
						req.flash('success', "Post deleted!");
						res.send('Success');
					}
				});
			}
		}else{
			console.log(err);
		}
	}).populate('author');
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