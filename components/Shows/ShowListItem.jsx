import React from 'react';

import styles from './showListItem.module.scss';
import { useShow } from '@/context';

export const ShowListItem = ({ show }) => {
  const { goToShow } = useShow();

  const handleJoinClick = () => {
    console.log(show);
    if (!show) return;
    goToShow(show.showId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.showName}>{show?.showId}</div>
      <div className={styles.watching}>
        ({show?.clientIds?.length}) watching
      </div>
      <button onClick={handleJoinClick}>Join</button>
    </div>
  );
};
