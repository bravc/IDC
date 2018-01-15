const socket = io.connect('http://localhost:8080');

//define all DOM elements
let message = $("#message"),
    btn = $("#output"),
    feedback = $("#feedback"),
    output = $("#output");

//Grab user data from page 
const user = message.attr('data');


//Show connection
socket.on('connection', function(){
    console.log('Connected...');
});

socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.sender + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});


btn.addEventListener('click', function(){
    socket.emit('chat', {
        sender: user.name,
        message: message.value
    });
    message.value = '';
});

message.addEventListener('keypress', function(){
    socket.emit('typing', user.name);
});