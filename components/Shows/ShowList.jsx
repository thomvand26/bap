import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { SEARCH } from '@/routes';
import { ShowListItem } from './ShowListItem';

import styles from './ShowList.module.scss';

/**
 * variant: one of: "default", "artistDashboard"
 */
export const ShowList = ({
  shows,
  loading,
  variant,
  className,
  cards,
  headers,
  isOnHome,
  inDashboard,
  useH2Headers,
  onDuplicate,
  onDelete,
  withBrowseAllButton,
}) => {
  const { t } = useTranslation(['shows']);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {headers?.length ? (
        <div
          className={`${styles.listHeaderContainer} ${
            inDashboard ? styles['listHeaderContainer--inDashboard'] : ''
          }`}
        >
          {headers.map((header, i) =>
            isOnHome ? (
              <h2
                key={`listHeader-${i}`}
                className={`h1 ${styles['listHeader--home']}`}
              >
                {header}
              </h2>
            ) : useH2Headers ? (
              <h2 key={`listHeader-${i}`} className={styles.listHeader}>
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
        {(shows?.length
          ? shows.sort?.(
              (showA, showB) =>
                new Date(showA?.startDate).getTime() -
                new Date(showB?.startDate).getTime()
            )
          : loading
          ? Array(3).fill(null)
          : []
        )?.map?.((show, i) => (
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
          <a className={styles.browseAllLink}>{t('shows:browse-all-shows')}</a>
        </Link>
      )}
    </div>
  );
};
