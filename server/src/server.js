const express = require('express');
const { Server } = require('http');
const SocketIO = require('socket.io');


export const app = express();
export const http = Server(app);
export const io = SocketIO(http, {
  path: '/ws'
});