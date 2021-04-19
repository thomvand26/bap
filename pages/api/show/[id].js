import { withDB } from 'middleware';
import { Show } from 'models';

const show = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
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
        responseData = await Show.findByIdAndUpdate(id, req.body, {
          new: true,
        }).populate('owner', ['_id', 'username']);
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
