const { io } = require('./server');
const debug = require('debug')('chat-app');

export class Users {
  static store = new Map();

  static register(user) {
    Users.store.set(user.username, user);
    debug('new user registered: '+ user.username);
    io.emit('members', Users.usernames);
  }

  static get usernames() {
    return Array.from(Users.store.keys());
  }

  static getUser(username) {
    return this.store.get(username);
  }

  static unregister(username) {
    Users.store.delete(username);
    debug('user unregistered: '+ username);
    io.emit('members', Users.usernames);
  }
}