import { Types } from 'mongoose';

import { ChatMessage, Chatroom } from '../../models';
import { defaultShowPopulation, resetLastSocketShow } from './showUtils';

export const defaultChatroomPopulation = [
  {
    path: 'owner',
    select: ['_id', 'username'],
  },
  {
    path: 'members.user',
    select: ['_id', 'username'],
  },
  {
    path: 'participants.user',
    select: ['_id', 'username'],
  },
];

const sendToUniqueSockets = ({ emitType, emitData, socketIds, io }) => {
  // Don't emit twice (by creating a new array with only unique values)
  let uniqueSocketIds = new Map();

  socketIds.forEach((socketId) => {
    uniqueSocketIds.set(socketId, socketId);
  });

  Array.from(uniqueSocketIds.values()).forEach((socketId) => {
    io.to(`${socketId}`).emit(emitType, emitData);
  });
};

export const sendToAllMemberSocketsInChatroom = ({
  show,
  extraSocketIds = [],
  originalChatroom,
  chatroom,
  type,
  io,
}) => {
  console.log('sendToAllMemberSocketsInChatroom');

  // Get the socketIds
  let memberSocketIds = show?.connectedUsers?.filter((userObject) => {
    const userToCheck = (chatroom || originalChatroom).members.map(
      (member) => `${member?._id || member}`
    );
    return userToCheck.includes(`${userObject?.user?._id}`);
  });

  memberSocketIds = memberSocketIds.map((userObject) => userObject?.socketId);

  sendToUniqueSockets({
    emitType: 'chatroomUpdate',
    emitData: { type, chatroom },
    socketIds: [...extraSocketIds, ...memberSocketIds],
    io,
  });
};

export const leaveChatroomsByUserInShow = async ({
  showId,
  userId,
  io,
  removeFromShowUpdates,
}) => {
  if (!showId || !userId) return;

  // Get Chatrooms linked to Show
  const chatrooms = await Chatroom.find({ show: showId })
    .populate([
      ...defaultChatroomPopulation,
      { path: 'show', populate: defaultShowPopulation },
    ])
    .lean()
    .exec();

  // Remove all connections of the User in all those Chatrooms
  await Chatroom.bulkWrite([
    {
      updateMany: {
        filter: {
          show: showId,
        },
        update: {
          $pull: { participants: { user: userId } },
        },
      },
    },
  ]);

  // Kick the user from all socket rooms connected to those chatrooms
  // and return the chatrooms with updated participants list
  const updatedChatrooms = chatrooms?.map((chatroom) => {
    let newParticipantsList = [];
    let userConnectionsList = [];

    chatroom?.participants.forEach((userObject) => {
      if (`${userObject.user}` === `${userId}`) {
        userConnectionsList.push(userObject);
      } else {
        newParticipantsList.push(userObject);
      }
    });

    if (io) {
      const userSocketIds = userConnectionsList.map(
        (userObject) => userObject.socketId
      );

      userSocketIds.map((socketId) => {
        if (!socketId) return;
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.leave(`${chatroom?._id}`);

          if (removeFromShowUpdates) {
            socket.emit('kicked', { type: 'show', data: showId });
            socket.leave(`${showId}`);
            resetLastSocketShow(socket);
          }
        }
      });
    }

    const updatedChatroom = {
      ...chatroom,
      participants: newParticipantsList,
    };

    sendToAllMemberSocketsInChatroom({
      show: updatedChatroom?.show,
      originalChatroom: chatroom,
      chatroom: updatedChatroom,
      io,
    });

    return updatedChatroom;
  });

  return updatedChatrooms;
};

export const leaveChatroomsBySocketId = async ({
  socketId,
  io,
  removeFromShowUpdates,
}) => {
  if (!socketId) return;
  console.log('leaveChatroomsBySocketId: ', socketId);

  // Get Chatrooms linked to socketId
  const chatrooms = await Chatroom.find({
    'participants.socketId': socketId,
  })
    .populate([
      ...defaultChatroomPopulation,
      { path: 'show', populate: defaultShowPopulation },
    ])
    .lean()
    .exec();

  // Remove all connections of the User in all those Chatrooms
  await Chatroom.bulkWrite([
    {
      updateMany: {
        filter: {
          'participants.socketId': socketId,
        },
        update: {
          $pull: { participants: { socketId } },
        },
      },
    },
  ]);

  // Kick the user from all socket rooms connected to those chatrooms
  // and return the chatrooms with updated participants list
  const updatedChatrooms = chatrooms?.map((chatroom) => {
    let newParticipantsList = [];
    let userConnectionsList = [];

    chatroom?.participants.forEach((userObject) => {
      if (`${userObject.socketId}` === `${socketId}`) {
        userConnectionsList.push(userObject);
      } else {
        newParticipantsList.push(userObject);
      }
    });

    if (io) {
      const userSocketIds = userConnectionsList.map(
        (userObject) => userObject.socketId
      );

      userSocketIds.map((userSocketId) => {
        if (!userSocketId) return;
        const socket = io.sockets.sockets.get(userSocketId);
        if (socket) {
          socket.leave(`${chatroom?._id}`);
          console.log(`leaving socket: ${socket?.lastShow}`);

          if (removeFromShowUpdates) {
            socket.emit('kicked', { type: 'show', data: socket?.lastShow });
            socket.leave(`${socket?.lastShow}`);
            resetLastSocketShow(socket);
          }
        }
      });
    }

    const updatedChatroom = {
      ...chatroom,
      participants: newParticipantsList,
    };

    sendToAllMemberSocketsInChatroom({
      show: updatedChatroom?.show,
      originalChatroom: chatroom,
      chatroom: updatedChatroom,
      io,
    });

    return updatedChatroom;
  });

  return updatedChatrooms;
};

// Leave all previous Chatrooms and socket rooms linked to the user
// and join new ones
export const joinChatroom = async ({ chatroomId, userId, socket, io }) => {
  console.log('chatroomId, userId, socket.id');
  console.log(chatroomId, userId, socket.id);
  if (!chatroomId || !userId || !socket) return;

  // Leave previous chatrooms linked to this socket
  await leaveChatroomsBySocketId({ socketId: socket.id, io });

  // Add user to Chatroom
  const chatroom = await Chatroom.findOneAndUpdate(
    {
      _id: Types.ObjectId(chatroomId),
    },
    {
      $addToSet: {
        participants: {
          user: userId,
          socketId: socket.id,
        },
      },
    },
    {
      new: true,
      populate: [
        ...defaultChatroomPopulation,
        { path: 'show', populate: defaultShowPopulation },
      ],
    }
  )
    .lean()
    .exec();

  // Get all messages in the chatroom
  const messages = await ChatMessage.find({
    chatroom: chatroomId,
  }).populate({
    path: 'owner',
    select: ['_id', 'username'],
  });

  // Join the general chatroom and the showUpdate room
  socket.join(`${chatroomId}`);

  console.info(`joined following chatroom: ${chatroomId}`);

  let userSocketIdsInChatroom = chatroom?.show?.connectedUsers?.filter(
    (userObject) => `${userObject?.user?._id}` === `${userId}`
  );
  userSocketIdsInChatroom = userSocketIdsInChatroom.map(
    (userObject) => userObject?.socketId
  );

  sendToUniqueSockets({
    emitType: 'chatroomUpdate',
    emitData: { type: 'join', chatroom: { ...chatroom, messages } },
    socketIds: userSocketIdsInChatroom,
    io,
  });

  sendToAllMemberSocketsInChatroom({
    show: chatroom?.show,
    originalChatroom: chatroom,
    chatroom: { ...chatroom, messages },
    io,
  });

  return { chatroom, messages };
};

export const kickFromChatroom = async ({
  chatroomId,
  userId,
  execUserId,
  io,
}) => {
  // Get original chatroom
  const originalChatroom = await Chatroom.findById(chatroomId)
    .populate([
      ...defaultChatroomPopulation,
      {
        path: 'show',
        populate: defaultShowPopulation,
      },
    ])
    .lean()
    .exec();

  // Remove User from the Chatroom
  await Chatroom.findOneAndUpdate(
    execUserId
      ? {
          _id: chatroomId,
          owner: execUserId,
        }
      : {
          _id: chatroomId,
        },
    {
      $pull: {
        members: userId,
      },
    }
  );

  await Chatroom.findOneAndUpdate(
    execUserId
      ? {
          _id: chatroomId,
          owner: execUserId,
        }
      : {
          _id: chatroomId,
        },
    {
      $pull: { participants: { user: userId } },
    }
  );

  const updatedChatroom = await Chatroom.findOneAndUpdate(
    execUserId
      ? {
          _id: chatroomId,
          owner: execUserId,
        }
      : {
          _id: chatroomId,
        },
    {
      $pull: {
        participants: { user: userId },
      },
    },
    {
      new: true,
      populate: defaultChatroomPopulation,
    }
  );

  if (!updatedChatroom)
    throw Error('execUser is not the owner of the Chatroom!');

  const generalChatroom = await Chatroom.findOne({
    show: originalChatroom?.show?._id,
    isGeneral: true,
  })
    .lean()
    .exec();

  // Leave socket room
  let userSocketIdsInRoom = originalChatroom?.show?.connectedUsers?.filter(
    (userObject) => `${userObject?.user?._id}` === `${userId}`
  );
  userSocketIdsInRoom = userSocketIdsInRoom.map(
    (userObject) => userObject?.socketId
  );

  userSocketIdsInRoom?.forEach?.(async (socketId) => {
    if (!socketId) return;

    const socket = io.sockets.sockets.get(socketId);

    if (socket) {
      socket.leave(`${chatroomId}`);
      console.log(`leaving socket: ${chatroomId}`);

      // Join general chatroom
      const socketResponse = await joinChatroom({
        chatroomId: generalChatroom?._id,
        userId,
        socket,
        io,
      });

      console.log(socketResponse);
      socket.emit('kicked', {
        type: 'chatroom',
        data: { originalChatroom, generalChatroom: socketResponse },
      });
    }
  });

  // Send update to everyone in chatroom
  sendToAllMemberSocketsInChatroom({
    show: originalChatroom?.show,
    originalChatroom,
    chatroom: updatedChatroom,
    io,
  });

  return updatedChatroom;
};

// Can also be used to delete the general Chatroom of a show (when deleting a show)
export const deleteChatroom = async ({
  chatroomId,
  execUserId,
  isGeneral,
  io,
}) => {
  // Get original chatroom
  const originalChatroom = await Chatroom.findOne({
    _id: chatroomId,
    owner: execUserId,
    isGeneral: !!isGeneral,
  })
    .populate([
      ...defaultChatroomPopulation,
      {
        path: 'show',
        populate: defaultShowPopulation,
      },
    ])
    .lean()
    .exec();

  const deletedChatroomMessages = await ChatMessage.remove({
    chatroom: chatroomId,
  });

  const deletedChatroom = await Chatroom.findOneAndDelete({
    _id: chatroomId,
    owner: execUserId,
    isGeneral: !!isGeneral,
  });

  if (!deletedChatroom)
    throw Error('execUser is not the owner of the Chatroom!');

  const generalChatroom = isGeneral
    ? null
    : await Chatroom.findOne({
        show: originalChatroom?.show?._id,
        isGeneral: true,
      })
        .lean()
        .exec();

  // Leave socket room
  originalChatroom?.participants?.forEach?.(async (participant) => {
    if (!participant?.socketId) return;

    const socket = io.sockets.sockets.get(participant.socketId);

    if (socket) {
      socket.leave(`${chatroomId}`);
      console.log(`leaving socket: ${chatroomId}`);

      if (!isGeneral) {
        // Join general chatroom
        const socketResponse = await joinChatroom({
          chatroomId: generalChatroom?._id,
          userId: participant?.user?._id,
          socket,
          io,
        });

        socket.emit('kicked', {
          type: 'chatroom',
          data: { originalChatroom, generalChatroom: socketResponse },
        });
      }
    }
  });

  // // Send update to everyone in chatroom
  // sendToAllMemberSocketsInChatroom({
  //   show: originalChatroom?.show,
  //   originalChatroom,
  //   chatroom: originalChatroom,
  //   io,
  // });

  return deletedChatroom;
};
