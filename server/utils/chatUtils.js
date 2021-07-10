export const emitChatUpdate = ({
  io,
  chatroomId,
  message,
  deleteChatMessage,
}) => {
  if (chatroomId) {
    io.to(`${chatroomId}`).emit('chatUpdate', {
      type: deleteChatMessage ? 'chatDelete' : 'chat',
      message,
    });
  }
};
