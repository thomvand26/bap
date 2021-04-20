import React from 'react';
import { useRouter } from 'next/router';
import { ShowListItem } from './ShowListItem';
import { CREATE_SHOW } from '../../routes';

import styles from './showList.module.scss';
import { useShow } from '@/context';

export const ShowList = (showCreateShowBtn) => {
  const { playingShows } = useShow();
  const router = useRouter();

  const handleCreateClick = () => {
    router.push(CREATE_SHOW);
  };
  console.log(playingShows);

  return (
    <div className={styles.container}>
      <div className={styles.showList}>
        {playingShows.map?.((show) => (
          <ShowListItem key={show.showId} show={show} />
        ))}
      </div>
      {showCreateShowBtn && (
        <button onClick={handleCreateClick}>Create Show</button>
      )}
    </div>
  );
};
