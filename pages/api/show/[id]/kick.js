import { withDB } from 'middleware';
import { Show, Chatroom, ChatMessage } from 'models';
import { getSession } from 'next-auth/client';

import { emitShowsUpdate } from '@/server';

const kickPlayer = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;
    console.log(req.body.userId);
    // console.log(res?.socket);

    switch (method) {
      case 'POST':
        if (!session) throw new Error('Not logged in!');
        if (!res?.socket) throw new Error('Not connected!');
        if (!id) throw new Error('Invalid show id!');

        // Remove user from Show (connectedUsers)
        responseData = await Show.findOneAndUpdate(
          { _id: id, owner: session?.user?._id },
          {
            $pull: {
              connectedUsers: {
                user: req.body.userId,
              },
            },
          },
          {
            new: true,
          }
        ).populate([
          {
            path: 'owner',
            select: ['_id', 'username'],
          },
          {
            path: 'generalChatroom',
          },
          {
            path: 'connectedUsers.user',
            select: ['_id', 'username'],
          },
        ]);

        // TODO: Remove user from all Chatrooms within this Show

        // TODO: Remove user from socket rooms
        // socket.leave(showId);

        const io = req?.io;
        emitShowsUpdate({ io, show: responseData });
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

export default withDB(kickPlayer);
