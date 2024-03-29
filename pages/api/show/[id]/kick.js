import { getSession } from 'next-auth/client';

import { withDB } from '@/middleware';
import { leaveShow } from '@/server';

const kickUser = async (req, res) => {
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

        if (!session?.user?._id) throw new Error('Not logged in!');
        if (!res?.socket) throw new Error('Not connected!');
        if (!id) throw new Error('Invalid show id!');
        if (!io) throw new Error('No io!');

        responseData = await leaveShow({
          io,
          fromShowId: id,
          userIdToDelete: req.body.userId,
          ownerId: session.user._id,
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

export default withDB(kickUser);
