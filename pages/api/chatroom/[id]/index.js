import { getSession } from 'next-auth/client';

import { withDB } from 'middleware';
import { deleteChatroom } from '@/server';

const chatroom = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      // Delete a Chatroom
      case 'DELETE':
        const io = req.io;

        if (!session || !session?.user?._id) throw new Error('Not logged in!');
        if (!io) throw new Error('No io!');

        responseData = await deleteChatroom({
          chatroomId: id,
          execUserId: session?.user?._id,
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
