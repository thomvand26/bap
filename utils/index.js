export const upsertDocumentInArrayState = ({ setFunction, document, documentsArray }) => {
  const array = documentsArray || [document];
  
  array?.forEach?.(newDocument => {
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
  })
};

export const removeDocumentFromArrayState = ({ setFunction, document }) => {
  setFunction((prev) =>
    prev?.filter?.((prevDocument) => prevDocument?._id !== document?._id)
  );
};

export const filterShowsPlayingNow = ({ shows, onlyVisible }) => {
  const now = Date.now();

  return shows?.filter?.((show) => {
    const isCurrentlyPlaying =
      now >= new Date(show?.startDate).getTime() &&
      now < new Date(show?.endDate).getTime();
    const isVisible = show?.visible;
    return isCurrentlyPlaying && onlyVisible ? isVisible : true;
  });
};
