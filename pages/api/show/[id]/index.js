import { getSession } from 'next-auth/client';

import { defaultShowPopulation, emitShowsUpdate } from '@/server';
import { withDB } from 'middleware';
import { Show, Chatroom, ChatMessage, SongRequest, Poll } from 'models';

const show = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    const io = req.io;
    let responseData;
    let emitType;

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
            populate: defaultShowPopulation,
          }
        );

        emitType = 'update';

        break;

      case 'DELETE':
        if (!session) throw new Error('Not logged in!');

        // Delete the show (if requested by the owner)
        responseData = await Show.findOne({
          _id: id,
          owner: session?.user?._id,
        }).populate(defaultShowPopulation);

        if (!responseData) throw new Error('Invalid show!');

        await Show.findOneAndDelete({
          _id: id,
          owner: session?.user?._id,
        });

        // Remove all users from socket rooms
        const socketRoomsToLeave = (await Chatroom.find({ show: id })).map(
          (chatroom) => chatroom?._id
        );

        socketRoomsToLeave.forEach((socketRoom) => {
          io.sockets.in(`${socketRoom}`).sockets.forEach((socket) => {
            socket.leave(`${socketRoom}`);
          });
        });

        // Kick user (remove from showUpdate + send kicked emit) --> based on connectedUsers
        responseData.connectedUsers?.forEach?.((user) => {
          const socket = io.sockets.sockets.get(`${user?.socketId}`);
          socket?.emit('kicked', {
            type: 'show',
            data: { _id: id },
          });
          socket?.leave(`${id}`);
        });

        // Delete all Chatrooms, ChatMessages, SongRequests and Polls linked to this show
        if (responseData._id) {
          await Promise.all([
            Chatroom.deleteMany({ show: id }),
            ChatMessage.deleteMany({ show: id }),
            SongRequest.deleteMany({ show: id }),
            Poll.deleteMany({ show: id }),
          ]);
        }

        responseData = { _id: id };

        emitType = 'delete';

        break;

      default:
        throw new Error('Invalid method');
        break;
    }

    emitShowsUpdate({ io, type: emitType, show: responseData });

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

export default withDB(show);
