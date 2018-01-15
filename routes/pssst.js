const io = require('socket.io');


io.on('connection', function(socket){
    console.log('User connected' + socket);
});