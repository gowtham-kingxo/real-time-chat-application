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
    socket.emit('countUpdated', count);

    socket.on('incrementCount', () => {
        count += 1;
        // Notifies only the client that sent the update
        // socket.emit('countUpdated', count);
        // io notifies all the clients connected
        io.emit('countUpdated', count);
    });
})

server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});