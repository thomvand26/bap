import { Show } from '../../models';

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

export const emitShowsUpdate = async ({io, show, showId}) => {
  const updatedShow = show || await Show.findById(showId);

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

  // Remove from connectedUsers from the Show
  const updatedShow = await Show.findByIdAndUpdate(
    showId,
    {
      $unset: {
        [`connectedUsers.${socketId}`]: ''
      }
    },
    { new: true }
  );

  socket.leave(showId);

  emitShowsUpdate({io, show: updatedShow});
  // resetLastSocketShow(socket);
};
