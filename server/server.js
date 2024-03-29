const express = require('express');
const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);
const next = require('next');

const {
  connectDB,
  getAllShows,
  leaveShow,
  emitChatUpdate,
  removeAllSocketConnectionsInModels,
} = require('./utils');
const { ChatMessage } = require('../models');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

async function start() {
  await app.prepare();

  await connectDB();

  // Remove all socket references in chatrooms & shows
  await removeAllSocketConnectionsInModels();

  io.on('connection', (socket) => {
    socket.emit('selfUpdate', { socketId: socket.id });
    socket.emit('showsUpdate', {
      shows: getAllShows(io),
    });

    socket.on('disconnect', () => {
      leaveShow({ io, socket });
    });

    socket.on('leaveRequest', () => {
      leaveShow({ io, socket });
    });

    socket.on('sendChat', async (showId, chatroomId, ownerId, message) => {
      let newMessage = await ChatMessage.create({
        show: showId,
        owner: ownerId,
        chatroom: chatroomId,
        message,
      });

      newMessage = await newMessage
        .populate({
          path: 'owner',
        })
        .execPopulate();

      emitChatUpdate({ io, chatroomId, message: newMessage });
    });
  });

  server.get('*', (req, res) => {
    req.io = io;
    return handle(req, res);
  });

  server.post('*', (req, res) => {
    req.io = io;
    return handle(req, res);
  });

  server.put('*', (req, res) => {
    req.io = io;
    return handle(req, res);
  });

  server.delete('*', (req, res) => {
    req.io = io;
    return handle(req, res);
  });

  http.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on http://localhost:${port}`);
  });
}

start().catch((error) => console.error(error.stack));
