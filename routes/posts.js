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
					console.log(err);
				}else{
					res.send('Success');
				}
			});
		}
	}).populate('author');
});


router.post('/dislike/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}

	var disliked = false;

	Post.findById(req.params.id, function(err, post){
		if (err){
			res.status(500).send(err);
		}else{

			//Has anyone disliked it yet?
			if(!post.dislikes){
				post.dislikes.push(req.user);
			//Check if you've already liked it
			}else{

				post.dislikes.forEach(function(user){
					if(user._id.equals(req.user._id)){
						console.log("got here")
						disliked = true;
					}
				});
				//If you have seen it, tell ajax that
				if(disliked){
					console.log("seen it")
					res.send('already');
				//otherwise add it and save
				}else{
					post.dislikes.push(req.user);
					post.dislike_count++;
					post.save(function(err){
						if (err){
							console.log(err);
						}else{
							res.send('Success');
						}
					});
				}
			}
		}
	}).populate('dislikes');
});



router.delete('/delete/:id', ensureAuthenticated, function(req, res){
	let query = {_id: req.params.id}
	Post.findById(req.params.id, function(err, post){
		if(!err){
			console.log(post.author._id + "  " + req.user._id);
			if(!post.author._id.equals(req.user._id)){
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