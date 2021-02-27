// import Peer from "simple-peer";

const server = require('express')();
const http = require('http').Server(server);
const io = require('socket.io')(http);

const next = require('next');
const { v4: uuidv4 } = require('uuid');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const getAllRooms = () => {
  let availableRooms = [];
  const rooms = io.sockets.adapter.rooms;
  if (rooms && rooms.size) {
    rooms.forEach((value, key) => {
      if (!value.has(key)) {
        availableRooms.push({ roomId: key, clientIds: [...rooms.get(key)] });
      }
    });
  }
  return availableRooms;
};

const getRoomById = (roomId) => {
  return getAllRooms().find((room) => {
    return room.roomId === roomId;
  });
};

// const getRoomBySocketId = (clientId) => {
//   return getAllRooms().find((room) => {
//     return room.clientIds.find((clientIdTest) => clientIdTest === clientId);
//   });
// };

const emitClientsUpdate = () => {
  io.sockets.emit('clientsUpdate', {
    connectedSockets: [...io.sockets.sockets.keys()],
  });
};

// const emitRoomsUpdate = ({ socketId, roomId }) => {
const emitRoomsUpdate = (roomId) => {
  // const room = roomId ? getRoomById(roomId) : getRoomBySocketId(socketId);
  const room = getRoomById(roomId);

  io.sockets.emit('roomsUpdate', {
    rooms: getAllRooms(),
  });

  if (room) {
    io.to(room.roomId).emit('roomUpdate', room);
  }
};

const emitChatUpdate = (roomId, chat, message) => {
  const room = getRoomById(roomId);

  if (room) {
    io.to(room.roomId).emit('chatUpdate', {
      chat,
      message,
    });
  }
};

const resetLastSocketRoom = (socket) => {
  if (socket.lastRoom) {
    socket.leave(socket.lastRoom);
    socket.lastRoom = null;
  }
};

async function start() {
  await app.prepare();

  io.on('connection', (socket) => {
    socket.emit('selfUpdate', { socketId: socket.id });
    emitClientsUpdate();
    socket.emit('roomsUpdate', {
      rooms: getAllRooms(),
    });

    socket.on('disconnect', () => {
      // console.log('disconnecting', socket.lastRoom);
      emitRoomsUpdate(socket.lastRoom);
      emitClientsUpdate();
      resetLastSocketRoom(socket);
    });

    socket.on('createRequest', (callback) => {
      resetLastSocketRoom(socket);

      const roomId = uuidv4();
      socket.join(roomId);
      socket.lastRoom = roomId;

      // Send roomId back to client via a callback
      if (callback instanceof Function) callback(roomId);
      emitRoomsUpdate(roomId);
    });

    socket.on('joinRequest', (roomId, callback) => {
      if (socket.lastRoom !== roomId) resetLastSocketRoom(socket);

      if (!getRoomById(roomId)) {
        console.log('no such room');
        if (callback instanceof Function)
          callback({ type: 'error', reason: 'room_not_found' });
        socket.emit('roomUpdate', null);
        return;
      }

      socket.join(roomId);
      socket.lastRoom = roomId;

      if (callback instanceof Function) callback({ type: 'success' });

      // // Update client data
      // io.to(roomId).emit('roomUpdate', getRoomById(roomId));
      // console.log('roomUpdate');

      emitRoomsUpdate(roomId);
    });

    socket.on('sendChat', (roomId, chat, message) => {
      emitChatUpdate(roomId, chat, message);
    });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  http.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on http://localhost:${port}`);
  });
}

start().catch((error) => console.error(error.stack));
