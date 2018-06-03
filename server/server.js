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

const publicPath = path.join(__dirname, '../public');

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static(publicPath));

app.use('/', router);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome!',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined!',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);

    io.emit('newMessage', {
      from     : message.from,
      text     : message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

console.log(publicPath);
