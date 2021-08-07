import { getSession } from 'next-auth/client';

import { makeAllPollsInvisibleByShow, sendPollSocketUpdate } from '@/server';
import { withDB } from 'middleware';
import { Poll } from 'models';

const poll = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    let responseData;
    let emitType;

    if (!session || !session?.user?._id) throw new Error('Not logged in!');
    if (!io) throw new Error('No io!');

    const populatedPoll = await Poll.findById(id).populate('show');

    // Check if current user is the owner of the show
    if (`${populatedPoll?.show?.owner}` !== `${session.user._id}`)
      throw new Error("You can't do that!");

    switch (method) {
      // Update a poll
      case 'POST':
        const { visible, show } = req.body;

        if (visible === true) {
          await makeAllPollsInvisibleByShow(show);
        }

        responseData = await Poll.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        emitType = 'update';
        break;
      // Delete a poll
      case 'DELETE':
        responseData = await Poll.findByIdAndDelete(id);
        emitType = 'delete';
        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    // Send socket update
    if (
      // If is visible (before update)
      populatedPoll.visible ||
      // Or has changed from invisible to visible
      (!populatedPoll.visible && responseData?.visible)
    ) {
      sendPollSocketUpdate({
        io,
        type: emitType,
        updatedPoll: responseData,
      });
    }

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(poll);
