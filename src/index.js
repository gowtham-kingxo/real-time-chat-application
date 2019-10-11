const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users'); 

const { 
    generateMessage,
    generateLocationMessage,
} = require('./utils/messages');

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

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        
        socket.emit('newMessage', generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('newMessage', generateMessage(`${user.username} has joined!`));
        callback();
    });

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter();
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed');
        }

        io.emit('newMessage', generateMessage(msg));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('newMessage', generateMessage(`${user.username} has left!`));
        }
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit(
            'locationMessage', 
            generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`),
        );
        callback();
    });
})

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});