import { getSession } from 'next-auth/client';

import { defaultShowPopulation, deleteShow, emitShowsUpdate } from '@/server';
import { withDB } from 'middleware';
import { Show, Chatroom, ChatMessage, SongRequest, Poll } from 'models';

const show = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    let responseData;
    let emitType;

    switch (method) {
      case 'GET':
        responseData = await Show.findById(id).populate('owner', [
          '_id',
          'username',
        ]);

        break;

      case 'POST':
        if (!session) throw new Error('Not logged in!');

        responseData = await Show.findOneAndUpdate(
          { _id: id, owner: session?.user?._id },
          req.body,
          {
            new: true,
            populate: defaultShowPopulation,
          }
        );

        emitType = 'update';

        break;

      case 'DELETE':
        if (!session) throw new Error('Not logged in!');

        deleteShow({ showId: id, session, io });

        responseData = { _id: id };

        emitType = 'delete';

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    emitShowsUpdate({ io, type: emitType, show: responseData });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(show);
