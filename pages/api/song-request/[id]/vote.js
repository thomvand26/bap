import { getSession } from 'next-auth/client';

import {
  defaultSongRequestPopulation,
  sendSongRequestSocketUpdate,
} from '@/server';
import { withDB } from 'middleware';
import { SongRequest } from 'models';

const vote = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    let responseData;

    if (!session || !session?.user?._id) throw new Error('Not logged in!');
    if (!io) throw new Error('No io!');

    switch (method) {
      // Add vote to SongRequest
      case 'POST':
        // Update song request
        responseData = await SongRequest.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              upVoters: session.user._id,
            },
          },
          {
            new: true,
            populate: defaultSongRequestPopulation,
          }
        );

        break;

      // Remove vote from SongRequest
      case 'DELETE':
        if (!session || !session?.user?._id) throw new Error('Not logged in!');

        // Update song request
        responseData = await SongRequest.findOneAndUpdate(
          { _id: id, visible: true },
          {
            $pull: {
              upVoters: session.user._id,
            },
          },
          {
            new: true,
            populate: defaultSongRequestPopulation,
          }
        );

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    // Send socket update
    sendSongRequestSocketUpdate({
      io,
      type: 'update',
      updatedSongRequest: responseData,
    });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(vote);
