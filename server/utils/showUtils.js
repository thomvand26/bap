import { Chatroom, Show } from '../../models';
import { leaveAllChatrooms } from './index';

export const getAllShows = (io) => {
  let availableShows = [];
  const shows = io.sockets.adapter.rooms;
  if (shows && shows.size) {
    shows.forEach((value, key) => {
      if (!value.has(key)) {
        availableShows.push({ showId: key, clientIds: [...shows.get(key)] });
      }
    });
  }
  return availableShows;
};

export const getShowById = (io, showId) => {
  return getAllShows(io).find((show) => {
    return show.showId === showId;
  });
};

export const emitShowsUpdate = async ({ io, show, showId }) => {
  const updatedShow =
    show ||
    (await Show.findById(showId).populate([
      {
        path: 'owner',
        select: ['_id', 'username'],
      },
      {
        path: 'generalChatroom',
      },
      {
        path: 'connectedUsers.user',
        select: ['_id', 'username'],
      },
    ]));
  // console.log('show givven: ', show);

  // TODO: use Shows not socket connections
  io.sockets.emit('showsUpdate', {
    shows: getAllShows(io),
  });

  if (updatedShow) {
    io.to(`${updatedShow._id}`).emit('showUpdate', updatedShow);
  }
};

export const resetLastSocketShow = (socket) => {
  if (socket.lastShow) {
    socket.leave(socket.lastShow);
    socket.lastShow = null;
  }
};

export const leaveShow = async (io, socket) => {
  const showId = socket.lastShow;

  if (!showId) return;

  const socketId = socket?.id || socket?._id;

  // Get the userId if the user is participating in the show
  const foundShow = await Show.findOne({ 'connectedUsers.socketId': socketId }).exec();
  const userId = foundShow?.connectedUsers?.find?.(user => user.socketId === socketId)?.user;

  // Remove from connectedUsers from the Show
  const updatedShow = await Show.findByIdAndUpdate(
    showId,
    {
      $pull: {
        connectedUsers: {
          socketId,
        },
      },
    },
    {
      multi: true,
      new: true,
    }
  ).populate([
    {
      path: 'owner',
      select: ['_id', 'username'],
    },
    {
      path: 'generalChatroom',
    },
    {
      path: 'connectedUsers.user',
      select: ['_id', 'username'],
    },
  ]);

  // Leave all chatrooms
  await leaveAllChatrooms({ userId, socket });

  // Leave showUpdates
  socket.leave(showId);

  console.info(`left show ${showId}`);

  emitShowsUpdate({ io, show: updatedShow });
  // resetLastSocketShow(socket);
};
