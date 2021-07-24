import { getSession } from 'next-auth/client';

import { withDB } from 'middleware';
import { Poll } from 'models';
import { sendPollSocketUpdate } from '@/server';

const vote = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    const { optionIds } = req.body;
    let responseData;

    if (!session || !session?.user?._id) throw new Error('Not logged in!');
    if (!io) throw new Error('No io!');

    switch (method) {
      // Add/update vote in Poll
      case 'POST':
        // Remove this user from the options
        responseData = await Poll.findByIdAndUpdate(id, {
          $pull: {
            'options.$[].voters': session.user._id,
          },
        });

        // Add this user to the chosen options
        responseData = await Poll.findByIdAndUpdate(
          id,
          {
            $addToSet: {
              'options.$[option].voters': session.user._id,
            },
          },
          {
            arrayFilters: [{ 'option._id': { $in: optionIds } }],
            new: true,
          }
        );

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    // Send socket update
    if (responseData?.visible)
      sendPollSocketUpdate({
        io,
        type: 'update',
        updatedPoll: responseData,
      });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(vote);
