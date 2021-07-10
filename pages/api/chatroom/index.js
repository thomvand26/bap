import { getSession } from 'next-auth/client';

import {
  defaultChatroomPopulation,
  defaultShowPopulation,
  joinChatroom,
} from '@/server';
import { withDB } from 'middleware';
import { Chatroom } from 'models';

const chatroom = async (req, res) => {
  const { method } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      // Create/update a Chatroom
      case 'POST':
        if (!session || !session?.user?._id) throw new Error('Not logged in!');

        const io = req.io;

        if (!io) throw new Error('No io!');

        const { showId, socketId, name } = req.body;

        if (!showId || !socketId || !name)
          throw new Error('Not all fields are given');

        // Create/update the Chatroom
        responseData = await Chatroom.findOneAndUpdate(
          { owner: session.user._id, isGeneral: { $ne: true } },
          {
            owner: session.user._id,
            show: showId,
            $addToSet: {
              members: session.user._id,
            },
            name,
          },
          {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
            populate: [
              ...defaultChatroomPopulation,
              { path: 'show', populate: defaultShowPopulation },
            ],
          }
        );

        // Join socket room / send socket emit
        responseData = await joinChatroom({
          chatroomId: responseData?._id,
          userId: session.user._id,
          socket: io.sockets.sockets.get(socketId),
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

export default withDB(chatroom);
