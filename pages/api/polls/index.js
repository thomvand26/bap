import { getSession } from 'next-auth/client';

import { withDB } from 'middleware';
import { Poll, Show } from 'models';

const polls = async (req, res) => {
  const { method, body } = req;
  const session = await getSession({ req });

  try {
    let responseData;
    if (!session || !session?.user?._id) throw new Error('Not logged in!');

    switch (method) {
      case 'POST':
        // Make sure the user is the owner of the show
        const show = await Show.findOne({
          _id: body.show,
          owner: session.user._id,
        })
          .lean()
          .exec();

        // Find all polls linked to the show
        responseData = await Poll.find(
          show?._id ? { ...body, show: show._id } : { ...body, visible: true }
        )
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

export default withDB(polls);
