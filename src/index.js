const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express()
const server = http.createServer(app);
// pass http server to io
const io = socketio(server)

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.emit('welcomeMessage', 'Welcome to chat!!');
    socket.broadcast.emit('welcomeMessage', 'A new user has joined!');
    socket.on('sendMessage', (msg) => {
        io.emit('newMessage', msg);
    });

    socket.on('disconnect', () => {
        io.emit('newMessage', 'A user has left');
    });

    socket.on('sendLocation', (location) => {
        const userLocation = `Location: ${location.latitude}, ${location.longitude}`;
        console.log('userLocation', userLocation);
        io.emit('userLocation', userLocation);
    });
})

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});