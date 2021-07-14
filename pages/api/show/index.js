import { getSession } from 'next-auth/client';

import { withDB } from 'middleware';
import { Show } from 'models';
import {
  removeUndefinedFromObject,
  parseObjectStrings,
  emitShowsUpdate,
} from 'server/utils';

const show = async (req, res) => {
  const { method, query } = req;
  const session = await getSession({ req });

  let filters = removeUndefinedFromObject(query);
  filters = parseObjectStrings(filters);

  try {
    const io = req.io;
    let responseData;

    switch (method) {
      case 'GET':
        responseData = await Show.find({ ...filters }).populate('owner', [
          '_id',
          'username',
        ]);
        break;
      case 'POST':
        if (!session?.user?._id) throw new Error('Not logged in!');

        responseData = await Show.create({
          ...req.body,
          owner: session?.user?._id,
        });

        emitShowsUpdate({ io, type: 'create', show: responseData });
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

export default withDB(show);
