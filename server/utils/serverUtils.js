import { Show, Chatroom } from '../../models';

export const removeAllSocketConnectionsInModels = async () => {
  return await Promise.all([
    Show.updateMany({}, { connectedUsers: [] }),
    Chatroom.updateMany({}, { participants: [] }),
  ]);
};
