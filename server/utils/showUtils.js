import { Show, ChatMessage, Chatroom, Poll, SongRequest } from '../../models';
import { leaveChatroomsBySocketId, leaveChatroomsByUserInShow } from './';

export const defaultShowPopulation = [
  {
    path: 'owner',
    select: ['_id', 'username'],
  },
  {
    path: 'generalChatroom',
    populate: {
      path: 'participants.user',
      select: ['_id', 'username'],
    },
  },
  {
    path: 'connectedUsers.user',
    select: ['_id', 'username'],
  },
];

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

export const emitShowsUpdate = async ({ io, type, show, showId }) => {
  const updatedShow =
    show || (await Show.findById(showId).populate(defaultShowPopulation));

  io.sockets.emit('showsUpdate', { type, show: updatedShow });

  if (updatedShow) {
    io.to(`${updatedShow._id}`).emit('showUpdate', { type, show: updatedShow });
  }
};

export const resetLastSocketShow = (socket) => {
  if (socket.lastShow) {
    socket.lastShow = null;
  }
};

export const getAllSocketsByUserInShow = async ({
  userId,
  io,
  showId,
  show,
}) => {
  const updatedShow = show || (await Show.findById(showId));
  const userSocketIds = updatedShow?.connectedUsers
    ?.filter((userObject) => `${userObject.user}` === `${userId}`)
    .map((userObject) => userObject.socketId);
  return io
    ? userSocketIds.map((socketId) => io?.sockets?.sockets?.get?.(socketId))
    : userSocketIds;
};

// By socket? {io, socket}
// By userId? {io, fromShowId, userIdToDelete, ownerId}
export const leaveShow = async ({
  io,
  socket,
  fromShowId,
  userIdToDelete,
  ownerId,
}) => {
  const showId = fromShowId || socket?.lastShow;
  console.log(`leave show based on: ${userIdToDelete ? 'userId' : 'socket'}`);

  if (!showId) return;

  // Only for "by socket"
  const socketId = socket?.id;

  let userId = userIdToDelete;

  if (!userId) {
    // Get the userId if the user is participating in the show
    const foundShow = await Show.findOne({
      'connectedUsers.socketId': socketId,
    })
      .lean()
      .exec();
    userId = foundShow?.connectedUsers?.find?.(
      (user) => user.socketId === socketId
    )?.user;
  }

  if (!userId) return;

  // // Get all sockets to leave room
  // let userSocketIds = [socket?.id];

  // if (userIdToDelete) {
  //   const foundUserSocketIds = await getAllSocketsByUserInShow({
  //     userId,
  //     showId,
  //   });
  //   userSocketIds = [...userSocketIds, ...foundUserSocketIds];
  // }

  const showFilter = ownerId
    ? {
        _id: showId,
        owner: ownerId,
      }
    : {
        _id: showId,
      };

  // Remove from connectedUsers from the Show
  const updatedShow = await Show.findOneAndUpdate(
    showFilter,
    {
      $pull: {
        connectedUsers: userIdToDelete
          ? { user: userIdToDelete }
          : {
              socketId,
            },
      },
    },
    {
      multi: true,
      new: true,
    }
  ).populate(defaultShowPopulation);

  // console.log(userSocketIds);
  // userSocketIds.forEach((userSocketId) => {
  //   if (!userSocketId) return;

  //   const userSocket = io.sockets.sockets.get(userSocketId);

  //   if (userSocket) {
  //     resetLastSocketShow(userSocket);
  //     console.log(`leaving: ${showId}`);
  //     userSocket.leave(`${showId}`);
  //   }
  // });<

  if (!updatedShow) {
    return { message: 'no show found', filters: showFilters };
  }

  emitShowsUpdate({ io, show: updatedShow });

  if (userIdToDelete) {
    await leaveChatroomsByUserInShow({
      showId,
      userId,
      io,
      removeFromShowUpdates: true,
    });
  } else if (socketId) {
    await leaveChatroomsBySocketId({
      socketId,
      io,
      removeFromShowUpdates: true,
    });
  }

  console.info(`left show ${showId}`);

  return updatedShow;
};

export const deleteShow = async ({ showId, session, io }) => {
  let response;

  // Delete the show (if requested by the owner)
  response = await Show.findOne({
    _id: showId,
    owner: session?.user?._id,
  }).populate(defaultShowPopulation);

  if (!response) throw new Error('Invalid show!');

  await Show.findOneAndDelete({
    _id: showId,
    owner: session?.user?._id,
  });

  // Remove all users from socket rooms
  const socketRoomsToLeave = (await Chatroom.find({ show: showId })).map(
    (chatroom) => chatroom?._id
  );

  socketRoomsToLeave.forEach((socketRoom) => {
    io.sockets.in(`${socketRoom}`).sockets.forEach((socket) => {
      socket.leave(`${socketRoom}`);
    });
  });

  // Kick user (remove from showUpdate + send kicked emit) --> based on connectedUsers
  response.connectedUsers?.forEach?.((user) => {
    const socket = io.sockets.sockets.get(`${user?.socketId}`);
    socket?.emit('kicked', {
      type: 'show',
      data: { _id: showId },
    });
    socket?.leave(`${showId}`);
  });

  // Delete all Chatrooms, ChatMessages, SongRequests and Polls linked to this show
  if (response._id) {
    await Promise.all([
      Chatroom.deleteMany({ show: showId }),
      ChatMessage.deleteMany({ show: showId }),
      SongRequest.deleteMany({ show: showId }),
      Poll.deleteMany({ show: showId }),
    ]);
  }
};

