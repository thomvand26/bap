import { ChatMessage, Chatroom } from '../../models';
import { resetLastSocketShow } from './showUtils';

export const leaveChatroomsByUserInShow = async ({ showId, userId, io }) => {
  if (!showId || !userId) return;

  // Get Chatrooms linked to Show
  const chatrooms = await Chatroom.find({ show: showId }).exec();

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
          resetLastSocketShow(socket);
        }
      });
    }

    return {
      ...chatroom,
      participants: newParticipantsList,
    };
  });

  return updatedChatrooms;
};

export const leaveChatroomsBySocketId = async ({ socketId, io }) => {
  if (!socketId) return;
  console.log('leaveChatroomsBySocketId: ', socketId);

  // Get Chatrooms linked to socketId
  const chatrooms = await Chatroom.find({
    'participants.socketId': socketId,
  }).exec();

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
          resetLastSocketShow(socket);
        }
      });
    }

    return {
      ...chatroom,
      participants: newParticipantsList,
    };
  });

  return updatedChatrooms;
};

// Leave all previous Chatrooms and socket rooms linked to the user
// and join new ones
export const joinChatroom = async ({ chatroomIds, userId, socket }) => {
  if (!chatroomIds?.length || !userId || !socket) return;

  // Leave previous chatrooms linked to this socket
  await leaveChatroomsBySocketId({ socket: socket.id });

  // Add user to Chatroom
  await Chatroom.bulkWrite([
    {
      updateMany: {
        filter: {
          _id: { $in: chatroomIds },
        },
        update: {
          $addToSet: {
            participants: {
              user: userId,
              socketId: socket.id,
            },
          },
        },
      },
    },
  ]);

  // Get all messages in the chatroom
  const chat = await ChatMessage.find({
    chatroom: chatroomIds,
  }).populate({
    path: 'owner',
  });

  // Join the general chatroom and the showUpdate room
  socket.join(chatroomIds.map((id) => `${id}`));

  console.info(`joined following chatrooms: ${chatroomIds}`);

  return chat;
};

export const emitChatUpdate = ({
  io,
  chatroomId,
  message,
  deleteChatMessage,
}) => {
  if (chatroomId) {
    io.to(`${chatroomId}`).emit('chatUpdate', {
      type: deleteChatMessage ? 'chatDelete' : 'chat',
      message,
    });
  }
};
