import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from '../../context';
import { ShowListItem } from './ShowListItem';
import { CREATE_SHOW } from '../../routes';

import styles from './showList.module.scss';

export const ShowList = (showCreateShowBtn) => {
  // const { shows, createShow, goToShow } = useSession();
  const { shows } = useSession();
  const router = useRouter();

  const handleCreateClick = () => {
    router.push(CREATE_SHOW);
  };
  console.log(shows);

  return (
    <div className={styles.container}>
      <div className={styles.showList}>
        {shows.map?.((show) => (
          <ShowListItem key={show.showId} show={show} />
        ))}
      </div>
      {showCreateShowBtn && (
        <button onClick={handleCreateClick}>Create Show</button>
      )}
    </div>
  );
};
