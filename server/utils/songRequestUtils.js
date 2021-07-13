export const defaultSongRequestPopulation = [
  {
    path: 'owner',
    select: ['_id', 'username'],
  },
];

export const defaultSongRequestArraySort = (array) => {
  return array
    .sort(
      (songRequestA, songRequestB) =>
        songRequestB?.upVoters?.length - songRequestA?.upVoters?.length
    )
    .sort((songRequestA, songRequestB) =>
      songRequestA?.visible === songRequestB?.visible
        ? 0
        : songRequestA?.visible
        ? -1
        : 1
    );
};

export const sendSongRequestSocketUpdate = ({
  io,
  type,
  updatedSongRequest,
}) => {
  // console.log(
  //   'sending songrequest update to: ',
  //   updatedSongRequest?.show?._id || updatedSongRequest?.show
  // );
  io.to(`${updatedSongRequest?.show?._id || updatedSongRequest?.show}`).emit(
    'songRequestUpdate',
    { type, updatedSongRequest }
  );
};
