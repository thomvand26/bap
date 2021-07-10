import { getSession } from 'next-auth/client';

import { kickFromChatroom } from '@/server';
import { withDB } from 'middleware';

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
        const userId = session?.user?._id;

        if (!session) throw new Error('Not logged in!');
        if (!io) throw new Error('No io!');

        responseData = await kickFromChatroom({
          chatroomId: id,
          userId,
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
