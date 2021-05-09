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

export const emitShowsUpdate = (io, showId) => {
  // const show = showId ? getShowById(showId) : getShowBySocketId(socketId);
  const show = getShowById(io, showId);

  io.sockets.emit('showsUpdate', {
    shows: getAllShows(io),
  });

  if (show) {
    io.to(show.showId).emit('showUpdate', show);
  }
};

export const resetLastSocketShow = (socket) => {
  if (socket.lastShow) {
    socket.leave(socket.lastShow);
    socket.lastShow = null;
  }
};

export const leaveShow = (io, socket) => {
  const showId = socket.lastShow;

  if (!showId) return;

  socket.leave(showId);

  emitShowsUpdate(io, socket.lastShow);
  // resetLastSocketShow(socket);
};
