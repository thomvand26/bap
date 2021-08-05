import { getSession } from 'next-auth/client';
import { Types } from 'mongoose';

import { withDB } from 'middleware';
import {
  joinChatroom,
  emitShowsUpdate,
  defaultShowPopulation,
  defaultChatroomPopulation,
  defaultSongRequestPopulation,
  resetLastSocketShow,
} from '@/server';
import { Show, Chatroom, SongRequest, Poll } from 'models';

const join = async (req, res) => {
  const {
    method,
    io,
    query: { id: showId },
    body: { chatroomId, socketId, mustBeOwner },
  } = req;
  const session = await getSession({ req });

  try {
    let responseData;

    switch (method) {
      case 'POST':
        const userId = session?.user?._id;

        if (!userId) throw new Error('Not logged in!');
        if (!socketId) throw new Error('No socketId!');
        if (!showId) throw new Error('Invalid show id!');
        if (!io) throw new Error('No io!');

        const socket = io.sockets.sockets.get(`${socketId}`);

        if (!socket) {
          throw new Error('Invalid socket!');
        }

        // Fetch show
        let foundShow = await Show.findOne({
          _id: showId,
          ...(mustBeOwner ? { owner: Types.ObjectId(userId) } : {}),
        })
          .lean()
          .exec();

        if (!foundShow) {
          throw new Error('Show not found!');
        }

        // Reset the showId in the socket
        if (socket.lastShow !== showId) {
          resetLastSocketShow(socket);
          socket.leave?.(socket.lastShow);
        }

        if (!socket?.id) throw new Error('Socket has no id!');

        // Update connectedUsers in Show and get it
        foundShow = await Show.findOneAndUpdate(
          {
            _id: showId,
            ...(mustBeOwner ? { owner: Types.ObjectId(userId) } : {}),
          },
          {
            $addToSet: {
              connectedUsers: {
                user: userId,
                socketId: socket.id,
              },
            },
          },
          {
            multi: true,
            new: true,
          }
        ).populate(defaultShowPopulation);

        // Join (general) chatroom
        const joinResponse = await joinChatroom({
          chatroomId: chatroomId || foundShow?.generalChatroom?._id,
          userId,
          socket,
          io,
        });

        // Join general show updates
        socket.join(`${foundShow._id}`);

        // Get all available chatrooms for this user
        // (= general & joined chatrooms)
        const availableChatrooms = await Chatroom.find({
          $or: [
            { show: showId, members: Types.ObjectId(userId) },
            { show: showId, isGeneral: true },
          ],
        }).populate(defaultChatroomPopulation);

        // Get all visible SongRequests
        const songRequests = await SongRequest.find(
          {
            show: showId,
            ...(mustBeOwner ? {} : { visible: true }),
          },
          null,
          { populate: defaultSongRequestPopulation }
        )
          .lean()
          .exec();

        // Get presented Poll
        const presentedPoll = await Poll.findOne({
          show: showId,
          visible: true,
        })
          .lean()
          .exec();

        // Save the showId in the socket
        socket.lastShow = showId;

        responseData = {
          show: foundShow,
          messages: joinResponse?.messages,
          availableChatrooms,
          songRequests,
          presentedPoll,
        };

        emitShowsUpdate({ io, show: foundShow });

        // Emit invites
        const invitedToChatrooms = await Chatroom.find({
          invitedUsers: userId,
          show: showId,
        }).populate({ path: 'owner' });

        invitedToChatrooms?.forEach?.((chatroom) => {
          socket.emit('chatroomInvite', {
            chatroomId: chatroom?._id,
            chatroomName: chatroom?.name,
            owner: chatroom?.owner?.username,
            type: 'invite',
          });
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

export default withDB(join);
