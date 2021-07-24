import { getSession } from 'next-auth/client';

import {
  defaultSongRequestPopulation,
  sendSongRequestSocketUpdate,
} from '@/server';
import { withDB } from 'middleware';
import { SongRequest } from 'models';

const visible = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    const { visible } = req.body;
    let responseData;

    switch (method) {
      case 'POST':
        if (!session || !session?.user?._id) throw new Error('Not logged in!');
        if (!io) throw new Error('No io!');

        // Check if current user is the owner of the show
        const populatedSongRequest = await SongRequest.findById(id).populate(
          'show'
        );

        if (`${populatedSongRequest?.show?.owner}` !== `${session?.user?._id}`)
          throw new Error("You can't do that!");

        // Update song request visibility
        responseData = await SongRequest.findByIdAndUpdate(
          id,
          {
            visible,
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
      type: 'hide',
      updatedSongRequest: responseData,
    });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(visible);
