import React, { useEffect, useState } from 'react';

import { useShow } from '@/context';
import { SongRequestListItem } from './SongRequestListItem';

import styles from './songRequests.module.scss';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

export const SongRequestList = ({ inDashboard }) => {
  const { currentSongRequests, loadingShow } = useShow();
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
      className={`${styles.list} ${!inDashboard ? 'scrollbars--dark' : ''} ${
        inDashboard ? styles['list--inDashboard'] : ''
      }`}
    >
      {loadingShow && (
        <div
          className={`${styles.loadingContainer} ${
            !inDashboard ? styles['loadingContainer--dark'] : ''
          }`}
        >
          <LoadingSpinner />
        </div>
      )}

      {!loadingShow &&
        !(inDashboard ? currentSongRequests : visibleCurrentSongRequests)
          ?.length && (
          <div className="centeredPlaceholder">No song requests yet</div>
        )}

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
