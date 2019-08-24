const socket = io();
socket.on('countUpdated', (count) => {
    console.log(`the count has been updated to: ${count}`);
})

document.querySelector('#incrementCounter').addEventListener('click', () => {
    console.log('clicked');
    socket.emit('incrementCount');
});

