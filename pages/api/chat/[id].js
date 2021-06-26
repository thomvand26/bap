import { getSession } from 'next-auth/client';

import { withDB } from '@/middleware';
import { ChatMessage } from '@/models';
import { emitChatUpdate } from '@/server';

const chat = async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      case 'DELETE':
        if (!session) throw new Error('Not logged in!');

        // Get the ChatMessage
        const chatMessage = await ChatMessage.findById(id).populate([
          {
            path: 'show',
            select: ['owner'],
          },
          {
            path: 'owner',
          },
        ]);

        // Check if the user is the owner of the Show in wicht the ChatMessage was send
        if (`${chatMessage?.show?.owner}` !== `${session?.user?._id}`) {
          throw new Error(
            "Only the owner of a show can delete it's chatMessages"
          );
        }

        // Delete the ChatMessage
        responseData = await ChatMessage.findByIdAndDelete(id);

        const io = req?.io;

        // Emit to sockets
        emitChatUpdate({
          io,
          chatroomId: chatMessage?.chatroom,
          message: chatMessage,
          deleteChatMessage: true,
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

export default withDB(chat);
