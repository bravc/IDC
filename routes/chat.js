const express = require('express');
const router = express.Router();
const io = require('../app').io;
let user = null;


router.get('/', ensureAuthenticated, function(req, res){
    user = req.user;
    res.render('chat');
});

//Setup 
io.on('connection', function(socket){
    console.log('User connected ' + socket.id);


    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
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