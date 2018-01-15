const express = require('express');
const router = express.Router();
const io = require('../app').io;


router.get('/', ensureAuthenticated, function(req, res){
    res.render('chat');
});

//Setup 
io.on('connection', function(socket){
    console.log('User connected ' + socket.id);


    socket.on('chat', function(data){
        console.log(data);
    });
});


// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      req.flash('danger', 'Please login');
      res.redirect('/');
    }
  }

module.exports = router;