export const upsertDocumentInArrayState = ({
  setFunction,
  document,
  documentsArray,
}) => {
  const array = documentsArray || [document];

  array?.forEach?.((newDocument) => {
    setFunction((prev) => {
      const foundDocument = prev?.find?.(
        (prevDocument) => prevDocument?._id === newDocument?._id
      );
      return foundDocument
        ? prev?.map?.((prevDocument) =>
            prevDocument?._id === newDocument?._id ? newDocument : prevDocument
          )
        : [...prev, newDocument];
    });
  });
};

export const removeDocumentFromArrayState = ({ setFunction, document }) => {
  setFunction((prev) =>
    prev?.filter?.((prevDocument) => prevDocument?._id !== document?._id)
  );
};

export const isShowIsCurrentlyPlaying = (show) => {
  const now = Date.now();

  return (
    now >= new Date(show?.startDate).getTime() &&
    now < new Date(show?.endDate).getTime()
  );
};

export const filterShowsPlayingNow = ({ shows, onlyVisible }) => {
  let currentlyPlayingShows = [];
  let upcomingShows = [];

  shows?.forEach?.((show) => {
    const isCurrentlyPlaying = isShowIsCurrentlyPlaying(show);
    const isVisible = show?.visible;

    if (onlyVisible && !isVisible) return;

    (isCurrentlyPlaying ? currentlyPlayingShows : upcomingShows).push(show);
  });

  return { currentlyPlayingShows, upcomingShows };
};

/**
 * array = [{ user: { _id: String, username: String, ... }, ... }, ...]
 * or
 * array = [{ user: String, ... }, ...]
 */
export const convertToUniqueParticipantsArray = (array) => {
  const isPopulated = array[0]?.user?._id;

  let userObjects = new Map();

  Object.values(array).forEach((userObject, i) => {
    userObjects.set(
      userObject?.user?._id || userObject?.user,
      userObject?.user
    );
  });

  userObjects = Array.from(userObjects.values());

  if (isPopulated) {
    userObjects.sort((userObjectA, userObjectB) =>
      userObjectA?.username?.localeCompare?.(userObjectB?.username)
    );
  }

  return userObjects;
};

export const dateBetweenShowDatesMongoDBQuery = ({ dateObject, isFullDay }) => {
  return isFullDay
    ? {
        // Starts before the end of the day
        startDate: {
          $lt: new Date(
            dateObject.getFullYear(),
            dateObject.getMonth(),
            dateObject.getDate() + 1
          ),
        },
        // Ends after before the beginning of the day
        endDate: { $gt: dateObject },
      }
    : { startDate: { $lte: dateObject }, endDate: { $gt: dateObject } };
};

export const getTotalPollVotes = (poll) => {
  return poll.options.reduce(
    (total, option) => total + option.voters.length,
    0
  );
};

export const getHighestPollOption = (poll) => {
  return poll.options.sort(
    (optionA, optionB) => optionB.voters.length - optionA.voters.length
  )[0];
};
