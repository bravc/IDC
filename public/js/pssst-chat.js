const socket = io.connect('http://localhost:8080');

$(document).ready(function(){

    //define all DOM elements
    var message = $('#message'),
        btn = $('#send'),
        feedback = $('#feedback'),
        output = $('#output');

    //Grab user data from page 
    const userName = message.attr('user');


    //Show users typing
    message.on('keypress', function(){
        socket.emit('typing', userName);
    });

    //Click function
    btn.on('click', function(){
        if(message.val() != ''){
            socket.emit('chat', {
                sender: userName,
                message: message.val()
            });
            message.val('');
        }
    });

    //Also allow enter key
    message.keyup(function(e){
        if(e.keyCode === 13){
            btn.click();
        }
    });


    //Show connection
    socket.on('connection', function(){
        console.log('Connected...');
    });

    //When chat is recieved, update the dom
    socket.on('chat', function(data){
        console.log(data);
        feedback.html('');
        output.append('<p><strong>' + data.sender + ': </strong>' + data.message + '</p>');
    });

    socket.on('typing', function(data){
        feedback.html('<p><em>' + data + ' is typing...</em></p>');
        setTimeout(function(){
            feedback.html('');
        }, 3000);
    });
});

