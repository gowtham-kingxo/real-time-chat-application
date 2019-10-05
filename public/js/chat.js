const socket = io();

socket.on('countUpdated', (count) => {
    console.log(`the count has been updated to: ${count}`);
})

socket.on('welcomeMessage', (msg) => {
    console.log('msg: ', msg);
});

socket.on('newMessage', (msg) => {
    console.log('New message..', msg);
});

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // here target is the form and we can use elements.message to access 
    // the input with name 'message'
    const message = event.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    });
});

// Handles send-location click event
document.querySelector('#send-location').addEventListener('click', () => {
    // Older browsers may not support Geolocation
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
       }, () => {
           console.log('Location shared!');
       });
    });
});