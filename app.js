const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const User = require('./models/users');
const Post = require('./models/post');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const PORT = 8080;

//Google Oauth stuff
const CLIENT_ID = "914555437419-p2jsddh6kg65t7mcphti5nh413q5ai35.apps.googleusercontent.com";
const CLIENT_SECRET = "zSbKNxh9kvqpvFcdvzm9SRCv";



//Initialize database
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
	console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
	console.log(err);
});


//Create app
const app = express();



// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/public', express.static(path.join(__dirname, 'public')) );




// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});



// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
			var namespace = param.split('.')
			, root    = namespace.shift()
			, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// Express Session Middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));


//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Serialize user data
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.use(flash());

//GoogleStrategy
passport.use(new GoogleStrategy({
		clientID: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		callbackURL: "/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
			User.findOne({ 'profile.id' : profile.id }, function (err, user) {
		
		//if error
		if(err){
			return done(err, user);
		}
		//If no user exists
		if(!user){
			user = new User({
				name: profile.displayName,
				profile: profile._json,
				profilePic: '/public/images/default-profile.png'
			});
			user.save(function(err){
				if (err) console.log(err);
				return done(err, user);
			});
		//If user exists just continue
		} else{
			return done(err, user);
		}
		});
	}
));

app.get('/auth/google',
	passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile'] }));

app.get('/auth/google/callback', 
	passport.authenticate('google', { 
		failureRedirect: '/login' ,
		successRedirect: '/',
		failureFlash: true
	}),
	function(req, res) {
		req.flash('success', 'You have successfully logged in');
		res.redirect('/');
	});


//Start server
app.listen(PORT, function(){
	console.log('Server started on port ' + PORT + "...");
});

//Home Route
app.get('/', function(req, res){

	User.find({}, function(err, users) {
		let userMap = {};
		let userPosts = [];

		//add all users
		users.forEach(function(user) {
			userMap[user._id] = user;
		});

		Post.find({}, function(err, posts){
			if(err){
				console.log(err);
			}else{
				posts.forEach(function(post){
					userPosts.push(post);
				});
			}

			userPosts.sort(function(a, b){
				return(a.date < b.date);
			});

			res.render('main', {users: userMap, posts: userPosts});
		}).populate('author');
	}).populate('posts');
});


//Allow routing though routes folder
let users = require('./routes/users');
app.use('/users', users);


//Allow routing through posts
let posts = require('./routes/posts')
app.use('/posts', posts);




