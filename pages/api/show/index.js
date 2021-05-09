import { withDB } from 'middleware';
import { Show } from 'models';
import { removeUndefinedFromObject } from 'server/utils';

const show = async (req, res) => {
  const {
    method,
    query: { owner },
  } = req;

  const filters = removeUndefinedFromObject({ owner });

  try {
    let responseData;

    switch (method) {
      case 'GET':
        responseData = await Show.find({ ...filters }).populate('owner', [
          '_id',
          'username',
        ]);
        break;
      case 'POST':
        responseData = await Show.create(req.body);
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
