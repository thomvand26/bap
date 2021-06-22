import { Chatroom, Show } from '../../models';

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

export const leaveAllRooms = async (socket) => {
  const showId = socket.lastShow;

  // TODO: Remove user from all Chatrooms within this Show (test with bulkWrite)
  // Chatroom.bulkWrite([
  //   updateMany({ participants: })
  // ])

  // TODO: Remove user from socket rooms
  // console.log(io.sockets.adapter.rooms);
  socket.leave(showId);
  // console.log(io.sockets.adapter.rooms);
}

export const leaveShow = async (io, socket) => {
  const showId = socket.lastShow;

  if (!showId) return;

  // const resp = await fetch(`${process.env.NEXTAUTH_URL}/api/show/${showId}/leave`);

  const socketId = socket?.id || socket?._id;

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

  leaveAllRooms(socket);

  emitShowsUpdate({ io, show: updatedShow });
  // resetLastSocketShow(socket);
};
