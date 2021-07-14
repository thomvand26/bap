import React, { useEffect, useState } from 'react';

import { useShow } from '@/context';
import { SongRequestListItem } from './SongRequestListItem';

import styles from './songRequests.module.scss';

export const SongRequestList = ({ inDashboard }) => {
  const { currentSongRequests } = useShow();
  const [visibleCurrentSongRequests, setVisibleCurrentSongRequests] =
    useState();

  useEffect(() => {
    if (inDashboard) return;

    setVisibleCurrentSongRequests(
      currentSongRequests.filter((songRequest) => songRequest.visible)
    );
  }, [currentSongRequests]);

  return (
    <ul
      className={`${styles.list} ${
        inDashboard ? styles['list--inDashboard'] : ''
      }`}
    >
      {inDashboard && !currentSongRequests?.length && 'No song requests yet'}

      {(inDashboard ? currentSongRequests : visibleCurrentSongRequests)?.map?.(
        (songRequest, i) => (
          <SongRequestListItem
            key={`${songRequest}-${i}`}
            songRequest={songRequest}
            inDashboard={inDashboard}
          />
        )
      )}
    </ul>
  );
};
