import { getSession } from 'next-auth/client';
import { Types } from 'mongoose';

import { joinChatroom } from '@/server';
import { withDB } from 'middleware';
import { Chatroom } from 'models';

const join = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      case 'POST':
        const io = req.io;
        const { socketId } = req.body;
        const userId = session?.user?._id;

        if (!session || !userId) throw new Error('Not logged in!');
        if (!io) throw new Error('No io!');
        if (!socketId) throw new Error('No socketId!');

        responseData = await Chatroom.findOneAndUpdate(
          {
            _id: id,
            $or: [
              { members: Types.ObjectId(userId) },
              { invitedUsers: userId },
              { isGeneral: true },
            ],
          },
          {
            $addToSet: {
              members: Types.ObjectId(userId),
            },
          }
        );

        if (
          (!responseData?.data?.success || !responseData?.data?.data) &&
          !responseData?._id
        )
          throw new Error('Invalid chatroom');

        responseData = await Chatroom.findOneAndUpdate(
          {
            _id: id,
            $or: [
              { members: Types.ObjectId(userId) },
              { invitedUsers: userId },
              { isGeneral: true },
            ],
          },
          {
            $pull: { invitedUsers: userId },
          }
        );

        const socket = io.sockets.sockets.get(socketId);

        if (!socket) throw new Error('Invalid socket!');

        responseData = await joinChatroom({
          chatroomId: id,
          userId: userId,
          socket,
          io,
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

export default withDB(join);
