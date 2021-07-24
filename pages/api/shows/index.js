import { withDB } from 'middleware';
import { Show } from 'models';

const shows = async (req, res) => {
  const { method, body } = req;

  try {
    let responseData;

    switch (method) {
      case 'POST':
        responseData = await Show.find({ ...body })
          .populate('owner', ['_id', 'username'])
          .lean()
          .exec();
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

export default withDB(shows);
