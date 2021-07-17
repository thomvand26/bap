import React from 'react';
import Link from 'next/link';

import { SEARCH } from '@/routes';
import { ShowListItem } from './ShowListItem';

import styles from './showList.module.scss';

export const ShowList = ({
  shows,
  variant = 'playing',
  cards,
  headers,
  isOnHome,
  onDuplicate,
  onDelete,
  withBrowseAllButton,
}) => {
  return (
    <div className={styles.container}>
      {headers?.length ? (
        <div className={styles.listHeaderContainer}>
          {headers.map((header, i) =>
            isOnHome ? (
              <h2
                key={`listHeader-${i}`}
                className={`h1 ${styles['listHeader--home']}`}
              >
                {header}
              </h2>
            ) : (
              <h3 key={`listHeader-${i}`} className={styles.listHeader}>
                {header}
              </h3>
            )
          )}
        </div>
      ) : null}
      <div
        className={`${styles.showList} ${
          cards ? styles['showList--cards'] : ''
        }`}
      >
        {(shows?.length ? shows
          .sort?.(
            (showA, showB) =>
              new Date(showA?.startDate).getTime() -
              new Date(showB?.startDate).getTime()
          ) : Array(3).fill(null))
          ?.map?.((show, i) => (
            <ShowListItem
              key={`${i}-${show?.showId || show?._id}`}
              show={show}
              variant={variant}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              cards={cards}
            />
          ))}
      </div>

      {withBrowseAllButton && (
        <Link href={SEARCH}>
          <a className={styles.browseAllLink}>Browse all shows</a>
        </Link>
      )}
    </div>
  );
};
