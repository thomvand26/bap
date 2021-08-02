import { getSession } from 'next-auth/client';

import { withDB } from 'middleware';
import { Show, ChatMessage, Chatroom, SongRequest, User } from 'models';
import { deleteShows, leaveShow, sendGoodbyeEmail } from '@/server';

const user = async (req, res) => {
  const { method } = req;
  const io = req.io;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      case 'POST':
        if (!session?.user?._id) throw new Error('Not logged in!');

        if (req.body.delete) {
          // Remove all shows of user (+ ChatMessages, Chatrooms, SongRequests & Polls)
          const allOwnedShows = await Show.find({ owner: session.user._id })
            .lean()
            .exec();

          await deleteShows({ shows: allOwnedShows, io, session });

          // Leave all shows the user is in (+ Chatrooms)
          const allJoinedShows = await Show.find({
            connectedUsers: {
              $elemMatch: { user: `${session.user._id}` },
            },
          })
            .lean()
            .exec();

          const leaveShows = await Promise.all(
            allJoinedShows.map(
              async (show) =>
                await leaveShow({
                  io,
                  fromShowId: show?._id,
                  userIdToDelete: session.user._id,
                })
            )
          );

          // Remove all ChatMessages, Chatrooms & SongRequests where user is owner of
          await Promise.all([
            ChatMessage.deleteMany({ owner: session.user._id }),
            Chatroom.deleteMany({ owner: session.user._id }),
            SongRequest.deleteMany({ owner: session.user._id }),
          ]);

          // Remove user
          responseData = await User.findByIdAndRemove(session.user._id);

          // Send goodbye email
          await sendGoodbyeEmail(responseData, req.body.locale);
        }

        responseData = await User.findOneAndUpdate(
          { _id: session.user._id },
          req.body,
          {
            new: true,
          }
        );

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

export default withDB(user);
