const express = require('express');
const cors = require('cors');
const debug = require('debug')('chat-app');
const path = require('path');
const {app, io, http} = require('./server');

const { Users } = require('./user-register');
const { User } = require("./active-user");
const { Message } = require('./message');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

http.listen(3000, function(){
  debug('listening on *:3000');
});

io.on('connection', socket => {
  const newUser = User.create(socket);
  Users.register(newUser);
});

app.post('/message', (req, res) => {

  debug('message received:', req.body.message);

  if (Math.random()*3 > 2) { // Random failure.
    debug('Temporary failure');
    res.status(500).json({
      success: false,
      message: 'Temporary Failure'
    }).end();
  }
  else {
    try {
      const msg = Message.build(req.header('X-Message-From'), req.body.message);
      io.emit('message', msg.text);
      res.status(200).json({
        success: true
      }).end();
    }
    catch (e) {
      res.status(400).json({
        success: false,
        message: e.message
      }).end();
    }
  }
});

app.use((err, req, res, next) => {
  if(err) {
    const { message } = err;
    res.json({message}).end();
  }
});
