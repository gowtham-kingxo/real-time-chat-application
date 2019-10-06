const socket = io();

// HTML Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

// HTML Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationURLTemplate = document.querySelector('#current-location').innerHTML;

socket.on('newMessage', (message) => {
    // console.log('New message..', msg);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });

    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationURLTemplate, {
        url,
    });

    $messages.insertAdjacentHTML('beforeend', html);
    console.log(url);
});

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');

    // here target is the form and we can use elements.message to access 
    // the input with name 'message'
    const message = event.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log('Message delivered!');
    });
});

// Handles send-location click event
$sendLocationButton.addEventListener('click', () => {
    // Older browsers may not support Geolocation
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
       }, () => {
           $sendLocationButton.removeAttribute('disabled');
           console.log('Location shared!');
       });
    });
});