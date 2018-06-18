const _ = require('lodash');

class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const newUser = { id, name, room };
    this.users.push(newUser);

    return newUser;
  }

  removeUser(id) {
    return _.remove(this.users, { id });
  }

  getUser(id) {
    return _.find(this.users, { id });
  }

  getAllUsers() {
    return this.users;
  }

  getUsersList(room) {
    return this.users
      .filter(usr => usr.room === room)
      .map(usr => usr.name);
  }
}

module.exports = {
  Users
};
