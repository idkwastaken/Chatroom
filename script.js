const socket = io();
const messagesDiv = document.getElementById('messages');
const connectionMessagesDiv = document.getElementById('connection-messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Retrieve username and color from localStorage
const username = localStorage.getItem('username') || 'Anonymous';
const color = localStorage.getItem('color') || '#000000';

// Emit a connection message when the user connects
socket.emit('user connected', { username, color });

// Send a message when the user clicks the send button
sendButton.addEventListener('click', () => {
    const message = messageInput.value;

    if (message) {
        socket.emit('chat message', { username, color, message });
        messageInput.value = '';
    }
});

// Listen for chat messages
socket.on('chat message', (data) => {
    const msgElement = document.createElement('div');
    msgElement.innerHTML = `<span style="color: ${data.color};"><${data.time}> ${data.username}: ${data.message}</span>`;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Listen for connection messages
socket.on('user connected', (data) => {
    const connectMsgElement = document.createElement('div');
    connectMsgElement.innerHTML = `<span style="color: #008000;"><${data.time}> ${data.username} is connected</span>`;
    connectionMessagesDiv.appendChild(connectMsgElement);
    connectionMessagesDiv.scrollTop = connectionMessagesDiv.scrollHeight;
});

// Listen for disconnection messages
socket.on('user disconnected', (data) => {
    const disconnectMsgElement = document.createElement('div');
    disconnectMsgElement.innerHTML = `<span style="color: #FF0000;"><${data.time}> ${data.username} has left</span>`;
    connectionMessagesDiv.appendChild(disconnectMsgElement);
    connectionMessagesDiv.scrollTop = connectionMessagesDiv.scrollHeight;
});

// Emit a disconnect message when the user disconnects
window.addEventListener('beforeunload', () => {
    socket.emit('user disconnected', { username });
});
