import React from 'react';
import { ShowListItem } from './ShowListItem';

import styles from './showList.module.scss';

export const ShowList = ({ shows, variant = 'playing', headers }) => {
  return (
    <div className={styles.container}>
      {headers?.length ? (
        <div className={styles.listHeaderContainer}>
          {headers.map((header, i) => (
            <h3 key={`listHeader-${i}`} className={styles.listHeader}>
              {header}
            </h3>
          ))}
        </div>
      ) : null}
      <div className={styles.showList}>
        {shows?.map?.((show) => (
          <ShowListItem
            key={show.showId || show._id}
            show={show}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
};
