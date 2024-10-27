const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('.'));

io.on('connection', (socket) => {
    socket.on('user connected', (data) => {
        const time = new Date().toLocaleTimeString();
        io.emit('user connected', { ...data, time });
    });

    socket.on('chat message', (data) => {
        const time = new Date().toLocaleTimeString();
        io.emit('chat message', { ...data, time });
    });

    socket.on('user disconnected', (data) => {
        const time = new Date().toLocaleTimeString();
        io.emit('user disconnected', { ...data, time });
    });

    socket.on('disconnect', () => {
        // This will trigger the 'user disconnected' event
        const username = socket.username; // Capture username from socket
        if (username) {
            const time = new Date().toLocaleTimeString();
            io.emit('user disconnected', { username, time });
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
