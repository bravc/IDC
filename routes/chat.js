const express = require('express');
const router = express.Router();
const io = require('../app').io;


router.get('/', function(req, res){
    res.render('chat');
});


io.on('connection', function(socket){
    console.log('User connected ' + socket.id);
});

module.exports = router;