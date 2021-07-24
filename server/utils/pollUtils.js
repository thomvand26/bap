import { Poll } from '../../models';

export const sendPollSocketUpdate = ({ io, type, updatedPoll }) => {
  io.to(`${updatedPoll?.show?._id || updatedPoll?.show}`).emit('pollUpdate', {
    type,
    updatedPoll,
  });
};

export const makeAllPollsInvisibleByShow = async (show) => {
  return await Poll.updateMany(
    {
      show,
      visible: true,
    },
    { visible: false }
  );
};
