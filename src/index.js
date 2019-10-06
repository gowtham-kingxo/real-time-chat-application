const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

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

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed');
        }

        io.emit('newMessage', msg);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('newMessage', 'A user has left');
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        callback();
    });
})

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});