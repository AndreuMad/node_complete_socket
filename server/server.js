const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const config = require('../config');
const port = config.port;

const constants = require('./constants');

const app = express();
const router = express.Router();
const server = http.createServer(app);
const io = socketIO(server);

const Users = require('./utils/user').Users;

const {
  generateMessage,
  generateLocationMessage
} = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');

const users = new Users();

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static(publicPath));

app.use('/', router);

io.on(constants.events.CONNECTION, (socket) => {
  socket.on(constants.events.JOIN, (params, callback) => {
    const { id } = socket;
    const {
      name,
      room
    } = params;

    if (!isRealString(name) || !isRealString(room)) {
      callback('Name and room are required');
    } else {
      socket.join(room);
      users.removeUser(id);
      users.addUser(id, name, room);

      io.to(room).emit(
        constants.events.UPDATE_USERS_LIST,
        users.getUsersList(room)
      );

      socket.emit(
        constants.events.NEW_MESSAGE,
        generateMessage('Admin', 'Welcome!')
      );
      socket.broadcast.to(room).emit(
        constants.events.NEW_MESSAGE,
        generateMessage('Admin', `${name} has joined!`)
      );
      // socket.leave() // leave the room
      // io.emit() // emit to every connected user
      // io.to('Room name').emit() // emit to every user connected to specific room
      // socket.broadcast.emit // emit for every user connected to socket server except for the current user
      // socket.broadcast.to('Room name').emit()
      // socket.emit() // emit for specific user
      callback();
    }
  });

  socket.on(constants.events.CREATE_MESSAGE, (message, callback) => {
    const user = users.getUser(socket.id);
    const {
      name,
      room
    } = user;

    if (user && isRealString(message.text)) {
      io.to(room).emit(
        constants.events.NEW_MESSAGE,
        generateMessage(name, message.text)
      );
    }

    callback();
  });

  socket.on(constants.events.CREATE_LOCATION_MESSAGE, (data) => {
    const user = users.getUser(socket.id);
    const {
      name,
      room
    } = user;
    const {
      latitude,
      longitude
    } = data;

    io.to(room).emit(
      constants.events.NEW_LOCATION_MESSAGE,
      generateLocationMessage(name, latitude, longitude)
    );
  });

  socket.on(constants.events.DISCONNECT, () => {
    const user = users.removeUser(socket.id)[0];
    const {
      name,
      room
    } = user;

    if (user) {
      io.to(room).emit(
        constants.events.UPDATE_USERS_LIST,
        users.getUsersList(room)
      );
      io.to(room).emit(
        constants.events.NEW_MESSAGE,
        generateMessage('Admin', `${name} has left.`)
      )
    }
  });
});

module.exports = {
  server
};
