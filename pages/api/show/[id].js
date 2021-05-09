import { withDB } from 'middleware';
import { Show } from 'models';
import { getSession } from 'next-auth/client';

const show = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;

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
          }
        ).populate('owner', ['_id', 'username']);
        break;
      case 'DELETE':
        if (!session) throw new Error('Not logged in!');
        responseData = await Show.deleteOne({
          _id: id,
          owner: session?.user?._id,
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

export default withDB(show);
