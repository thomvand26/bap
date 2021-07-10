import { getSession } from 'next-auth/client';
import { Types } from 'mongoose';

import {
  defaultChatroomPopulation,
  defaultShowPopulation,
  sendToAllMemberSocketsInChatroom,
} from '@/server';
import { withDB } from 'middleware';
import { Chatroom } from 'models';

const invite = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    const io = req.io;
    const { userId, socketId, cancel } = req.body;

    switch (method) {
      case 'POST':
        if (!session) throw new Error('Not logged in!');
        if (!io) throw new Error('No io!');
        if (!userId) throw new Error('No userId');
        if (!socketId) throw new Error('No socketId');

        // Add user to the Chatroom invitedUsers
        responseData = await Chatroom.findOneAndUpdate(
          {
            _id: id,
            $or: [
              {
                owner: Types.ObjectId(session?.user?._id),
              },
              {
                invitedUsers: Types.ObjectId(session?.user?._id),
              },
            ],
          },
          {
            [cancel ? '$pull' : '$addToSet']: {
              invitedUsers: userId,
            },
          },
          {
            new: true,
            populate: [
              ...defaultChatroomPopulation,
              { path: 'show', populate: defaultShowPopulation },
            ],
          }
        );

        if (!responseData?._id) throw new Error('Invalid chatroom');

        const show = responseData?.show;

        // Send Chatroom Update event to owner and socketId
        sendToAllMemberSocketsInChatroom({
          show,
          chatroomOwnerId: responseData.owner?._id,
          extraSocketIds: [socketId],
          chatroom: responseData,
          io,
        });

        // Send socket event to show popup (to all socket of the user based on the show):
        show?.connectedUsers?.forEach((userObject) => {
          if (`${userObject?.user?._id}` !== userId) return;

          const userSocketId = userObject?.socketId;

          if (!userSocketId) return;

          io.to(`${userSocketId}`).emit('chatroomInvite', {
            chatroomId: responseData?._id,
            chatroomName: responseData?.name,
            owner: responseData?.owner?.username,
            type: cancel ? 'cancel' : 'invite',
          });
        });

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(invite);
