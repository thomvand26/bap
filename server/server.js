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

const emitChatUpdate = (io, showId, chat, message) => {
  const show = getShowById(io, showId);

  if (show) {
    io.to(show.showId).emit('chatUpdate', {
      chat,
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

    socket.on('createRequest', (data, callback) => {
      resetLastSocketShow(socket);

      const showId = uuidv4();
      socket.join(showId);
      // console.log(showId);
      socket.lastShow = showId;

      // Send showId back to client via a callback
      if (callback instanceof Function) callback(showId);
      emitShowsUpdate(io, showId);
    });

    socket.on('joinRequest', (showId, callback) => {
      if (socket.lastShow !== showId) resetLastSocketShow(socket);
      // console.log(showId);
      if (!getShowById(io, showId)) {
        console.log('no such show');

        if (callback instanceof Function) {
          callback({ type: 'error', reason: 'show_not_found' });
        }

        socket.emit('showUpdate', null);
        return;
      }

      socket.join(showId);
      socket.lastShow = showId;

      if (callback instanceof Function) callback({ type: 'success' });

      // // Update client data
      // io.to(showId).emit('showUpdate', getShowById(showId));
      // console.log('showUpdate');

      emitShowsUpdate(io, showId);
    });

    socket.on('leaveRequest', (callback) => {
      leaveShow(io, socket);
    });

    socket.on('sendChat', (showId, chat, message) => {
      emitChatUpdate(io, showId, chat, message);
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
