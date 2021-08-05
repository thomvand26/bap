import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Layouts } from '@/layouts';
import { SearchForm, ShowList } from '@/components';

import styles from './SearchPage.module.scss';

export default function SearchPage() {
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [currentlyPlayingShows, setCurrentlyPlayingShows] = useState([]);
  const [loading, setLoading] = useState();
  const { t } = useTranslation(['search-page', 'shows']);

  const onSearch = (shows) => {
    setUpcomingShows(shows?.upcomingShows);
    setCurrentlyPlayingShows(shows?.currentlyPlayingShows);
  };

  return (
    <div>
      <div className={`container ${styles.top}`}>
        <h1>{t('search-page:page-title')}</h1>
        <section className={styles.searchSection}>
          <div className=" container__content">
            <SearchForm
              variant="light"
              onSearch={onSearch}
              setLoadingShows={setLoading}
            />
          </div>
        </section>
      </div>
      <section className={`container ${styles.showListSection}`}>
        {currentlyPlayingShows?.length ? (
          <ShowList
            shows={currentlyPlayingShows}
            className={'container__content'}
            loading={loading}
            headers={[t('shows:currently-playing')]}
            useH2Headers
          />
        ) : (
          <></>
        )}
        {upcomingShows?.length ? (
          <ShowList
            shows={upcomingShows}
            variant={'upcoming'}
            className={'container__content'}
            loading={loading}
            headers={[t('shows:upcoming-shows')]}
            useH2Headers
          />
        ) : (
          <></>
        )}
        {!currentlyPlayingShows?.length && !upcomingShows?.length ? (
          <div className={'container__content'}>
            {t('shows:no-shows-found')}
          </div>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
}

SearchPage.layout = Layouts.default;
SearchPage.isProtected = true;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'search-page',
        'auth',
        'navigation',
        'shows',
        'cookies',
        'common',
      ])),
    },
  };
}
