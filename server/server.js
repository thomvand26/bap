// import Peer from "simple-peer";

const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);

const { connectDB } = require('./utils');
const next = require('next');
const { v4: uuidv4 } = require('uuid');
const {
  getAllShows,
  resetLastSocketShow,
  leaveShow,
  emitShowsUpdate,
  getShowById,
} = require('./utils');
const { Show, ChatMessage } = require('../models');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

connectDB();

// const emitClientsUpdate = () => {
//   io.sockets.emit('clientsUpdate', {
//     connectedSockets: [...io.sockets.sockets.keys()],
//   });
// };

const emitChatUpdate = (io, showId, chatroomId, message) => {
  if (chatroomId) {
    io.to(`${chatroomId}`).emit('chatUpdate', {
      type: 'chat',
      message,
    });
  }
};

async function start() {
  await app.prepare();

  io.on('connection', (socket) => {
    socket.emit('selfUpdate', { socketId: socket.id });
    // emitClientsUpdate();
    socket.emit('showsUpdate', {
      shows: getAllShows(io),
    });

    socket.on('disconnect', () => {
      // console.log('disconnecting', socket.lastShow);
      leaveShow(io, socket);
      // emitClientsUpdate();
    });

    socket.on('joinRequest', async (showId, chatroomId, callback) => {
      try {
        if (socket.lastShow !== showId) resetLastSocketShow(socket);

        const foundShow = await Show.findById(showId).populate({
          path: 'generalChatroom',
        });

        const chat = await ChatMessage.find({
          chatroom: chatroomId || foundShow?.generalChatroom?._id,
        }).populate({
          path: 'owner',
        });

        if (!foundShow) {
          throw new { type: 'error', reason: 'show_not_found' }();
        }

        socket.join(`${chatroomId || foundShow?.generalChatroom?._id}`);
        socket.lastShow = showId;

        if (callback instanceof Function)
          callback({ type: 'success', data: { show: foundShow, chat } });

        emitShowsUpdate(io, showId);
      } catch (error) {
        if (!(callback instanceof Function)) return;
        if (!error.type || !error.reason) {
          callback({ type: 'error', reason: 'show_not_found' });
          return;
        }
        callback(error);
      }
    });

    socket.on('leaveRequest', (callback) => {
      leaveShow(io, socket);
    });

    socket.on('sendChat', async (showId, chatroomId, ownerId, message) => {
      // console.log(showId, chatroomId, message);

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

      emitChatUpdate(io, showId, chatroomId, newMessage);
    });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.post('*', (req, res) => {
    return handle(req, res);
  });

  server.put('*', (req, res) => {
    return handle(req, res);
  });

  server.delete('*', (req, res) => {
    return handle(req, res);
  });

  http.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on http://localhost:${port}`);
  });
}

start().catch((error) => console.error(error.stack));
