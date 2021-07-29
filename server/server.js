// import Peer from "simple-peer";

const express = require('express');
const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http);
const { Types } = require('mongoose');
const next = require('next');
// const path = require('path');

const {
  connectDB,
  getAllShows,
  resetLastSocketShow,
  leaveShow,
  emitShowsUpdate,
  joinChatroom,
  emitChatUpdate,
  defaultShowPopulation,
  defaultChatroomPopulation,
  defaultSongRequestPopulation,
} = require('./utils');
const { Show, ChatMessage, Chatroom, SongRequest } = require('../models');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// const emitClientsUpdate = () => {
//   io.sockets.emit('clientsUpdate', {
//     connectedSockets: [...io.sockets.sockets.keys()],
//   });
// };

async function start() {
  await app.prepare();

  await connectDB();

  // Remove all socket references in chatrooms & shows
  // Show.
  io.on('connection', (socket) => {
    socket.emit('selfUpdate', { socketId: socket.id });
    socket.emit('showsUpdate', {
      shows: getAllShows(io),
    });

    socket.on('disconnect', () => {
      leaveShow({ io, socket });
    });

    socket.on(
      'joinShowRequest',
      async ({ showId, chatroomId, userId }, callback) => {
        try {
          if (!userId) throw new { type: 'error', reason: 'user_not_found' }();

          // Reset the showId in the socket
          if (socket.lastShow !== showId) {
            resetLastSocketShow(socket);
            socket.leave(socket.lastShow);
          }

          if (!socket?.id) return;

          // Update connectedUsers in Show and get it
          const foundShow = await Show.findByIdAndUpdate(
            showId,
            {
              $addToSet: {
                connectedUsers: {
                  user: userId,
                  socketId: socket.id,
                },
              },
            },
            {
              multi: true,
              new: true,
            }
          ).populate(defaultShowPopulation);

          if (!foundShow) {
            throw new { type: 'error', reason: 'show_not_found' }();
          }

          // Join (general) chatroom
          const joinResponse = await joinChatroom({
            chatroomId: chatroomId || foundShow?.generalChatroom?._id,
            userId,
            socket,
            io,
          });

          // Join general show updates
          socket.join(`${foundShow._id}`);

          // Get all available chatrooms for this user
          // (= general & joined chatrooms)
          const availableChatrooms = await Chatroom.find({
            $or: [
              { show: showId, members: Types.ObjectId(userId) },
              { show: showId, isGeneral: true },
            ],
          }).populate(defaultChatroomPopulation);

          // Get all visible SongRequests
          const songRequests = await SongRequest.find(
            {
              show: showId,
              // visible: true,
            },
            null,
            { populate: defaultSongRequestPopulation }
          )
            .lean()
            .exec();

          // Save the showId in the socket
          socket.lastShow = showId;

          if (callback instanceof Function)
            callback({
              type: 'success',
              data: {
                show: foundShow,
                messages: joinResponse?.messages,
                availableChatrooms,
                songRequests,
              },
            });

          emitShowsUpdate({ io, show: foundShow });

          // Emit invites
          const invitedToChatrooms = await Chatroom.find({
            invitedUsers: userId,
          }).populate({ path: 'owner' });

          invitedToChatrooms?.forEach?.((chatroom) => {
            socket.emit('chatroomInvite', {
              chatroomId: chatroom?._id,
              chatroomName: chatroom?.name,
              owner: chatroom?.owner?.username,
              type: 'invite',
            });
          });
        } catch (error) {
          console.log(error);
          if (!(callback instanceof Function)) return;
          if (!error.type || !error.reason) {
            callback({ type: 'error', reason: 'show_not_found' });
            return;
          }
          callback(error);
        }
      }
    );

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

  // server.get('/service-worker.js', (req, res) => {
  //   console.log(path.join(__dirname, '../../', '.next/', 'service-worker.js'));
  //   app.serveStatic(req, res, path.join(__dirname, '../../', '.next/', 'service-worker.js'));
  // });

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
