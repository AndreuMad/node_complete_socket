const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const config = require('../config');
const port = config.port;

const app = express();
const router = express.Router();
const server = http.createServer(app);
const io = socketIO(server);

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static(publicPath));

app.use('/', router);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined!'));

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

module.exports = {
  server
};
