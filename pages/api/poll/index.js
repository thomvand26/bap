import { getSession } from 'next-auth/client';

import { makeAllPollsInvisibleByShow } from '@/server';
import { withDB } from 'middleware';
import { Poll } from 'models';

const createPoll = async (req, res) => {
  const { method } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    const { visible, show } = req.body;
    let responseData;

    switch (method) {
      // Create a Poll
      case 'POST':
        if (!session || !session?.user?._id) throw new Error('Not logged in!');
        if (!show) throw new Error('No show!');
        if (!io) throw new Error('No io!');

        if (visible === true) {
          await makeAllPollsInvisibleByShow(show);
        }

        // Create Poll
        responseData = await Poll.create(req.body);

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

export default withDB(createPoll);
