const socket = io.connect('http://bravc.me');

$(document).ready(function(){

    //define all DOM elements
    var message = $('#message'),
        btn = $('#send'),
        feedback = $('#feedback'),
        output = $('#output'),
        chatWindow = $('chat-window');

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
        feedback.html('');
        output.append('<p><strong>' + data.sender + ': </strong>' + data.message + '</p>');
        $("#chat-window").scrollTop($("#chat-window")[0].scrollHeight);        
    });

    socket.on('typing', function(data){
        $("#chat-window").scrollTop($("#chat-window")[0].scrollHeight);        feedback.html('<p><em>' + data + ' is typing...</em></p>');
        setTimeout(function(){
            feedback.html('');
        }, 3000);
    });
});

