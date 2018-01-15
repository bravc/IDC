const socket = io.connect('http://localhost:8080');


socket.on('connection', function(){
    console.log('Connected...');
});