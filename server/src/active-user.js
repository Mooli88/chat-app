const { io } = require('./server');
const name = require('random-name');
const { Users } = require('./user-register');
const { Message } = require('./message');
const debug = require('debug')('chat-app');

export class User {
  constructor(socket, username) {
    this.socket = socket;
    this.username = username;
    this.configureListeners();
  }

  configureListeners() {
    this.socket.emit('private-welcome', this.username);
    this.socket.on('disconnect', () => this.destroy());
  }

  destroy() {
    Users.unregister(this.username);
  }

  sendMessage(text) {
    const msg = Message.build(this, text);
    if (msg) {
      debug('new message from ' + this.username);
      debug(msg);
      io.emit('message', msg.text);
    } else {
      debug('Blank message, ignored');
    }
  }

  static create(socket) {
    return new User(socket, User.createName());
  }

  static salt() {
    return '-' + Math.round((Math.random() * 10000));
  }

  static createName() {
    let newName = name.first() + User.salt();
    while (Users.usernames.indexOf(newName) > -1) {
      newName = name.first() + User.salt();
    }
    return newName;
  }
}