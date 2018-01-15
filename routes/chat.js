const express = require('express');
const router = express.Router();
const app = require('../app');
const io = require('socket.io')(app);


router.get('/', function(req, res){
    res.render('pssst');
});


io.on('connection', function(socket){
    console.log('User connected' + socket);
});

module.exports = router;