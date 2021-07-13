import { getSession } from 'next-auth/client';

import {
  defaultSongRequestPopulation,
  sendSongRequestSocketUpdate,
} from '@/server';
import { withDB } from 'middleware';
import { SongRequest } from 'models';

const songRequest = async (req, res) => {
  const { method } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    const { showId, song } = req.body;
    let responseData;

    switch (method) {
      // Create a SongRequest
      case 'POST':
        if (!session || !session?.user?._id) throw new Error('Not logged in!');
        if (!showId) throw new Error('No showId!');
        if (!song) throw new Error('No song!');
        if (!io) throw new Error('No io!');

        // Check if SongRequest limit is reached
        const songRequestsByThisUser = await SongRequest.find(
          {
            owner: session.user._id,
            show: showId,
          },
          null,
          { populate: 'show' }
        );

        if (
          `${songRequestsByThisUser[0]?.show?.owner}` !==
            `${session.user._id}` &&
          songRequestsByThisUser?.length &&
          songRequestsByThisUser?.length >=
            songRequestsByThisUser[0]?.show?.maxSongRequestsPerUser
        )
          throw new Error('Song request limit reached!');

        // Create SongRequest
        responseData = await SongRequest.create({
          owner: session.user._id,
          show: showId,
          song,
          upVoters: [session.user._id],
        });

        responseData = await responseData
          .populate(defaultSongRequestPopulation)
          .execPopulate();

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    // Send socket update
    sendSongRequestSocketUpdate({
      io,
      type: 'create',
      updatedSongRequest: responseData,
    });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(songRequest);
