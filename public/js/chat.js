const socket = io();
socket.on('countUpdated', (count) => {
    console.log(`the count has been updated to: ${count}`);
})

socket.on('welcomeMessage', (msg) => {
    console.log('msg: ', msg);
});

socket.on('newMessage', (msg) => {
    console.log('New message..', msg);
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.querySelector('input').value;
    socket.emit('sendMessage', message);
});
