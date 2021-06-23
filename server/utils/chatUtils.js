import { ChatMessage, Chatroom } from '../../models';

// Leave all Chatrooms and socket rooms linked to the user
export const leaveAllChatrooms = async ({userId, socket}) => {
  // Find all Chatrooms linked to the user
  const chatrooms = await Chatroom.find({participants: userId}).exec();

  // Remove user from all linked chatrooms
  await Chatroom.bulkWrite([
    {
      updateMany: {
        filter: {
          participants: userId,
        },
        update: {
          $pull: {
            participants: userId,
          },
        },
      },
    },
  ]);

  // Leave all socket rooms
  chatrooms.forEach(chatroom => socket.leave(`${chatroom._id}`));

  console.info('left all previous chatrooms');

  return chatrooms;
}

// Leave all previous Chatrooms and socket rooms linked to the user
// and join new ones
export const joinChatroom = async ({ chatroomIds, userId, socket }) => {
  if (!chatroomIds?.length || !userId) return;

  // Leave previous chatrooms
  await leaveAllChatrooms({userId, socket});

  // Add user to Chatroom
  await Chatroom.bulkWrite([
    {
      updateMany: {
        filter: {
          _id: { $in: chatroomIds },
        },
        update: {
          $pull: {
            participants: userId,
          },
        },
      },
    },
    {
      updateMany: {
        filter: {
          _id: { $in: chatroomIds },
        },
        update: {
          $push: {
            participants: userId,
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
