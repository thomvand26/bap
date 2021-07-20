import React, { useState } from 'react';

import { Layouts } from '@/layouts';
import { SearchForm, ShowList } from '@/components';

import styles from './searchPage.module.scss';

export default function SearchPage() {
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [currentlyPlayingShows, setCurrentlyPlayingShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const onSearch = (shows) => {
    setUpcomingShows(shows?.upcomingShows);
    setCurrentlyPlayingShows(shows?.currentlyPlayingShows);
  };

  return (
    <div>
      <div className={`container ${styles.top}`}>
        <h1>Search shows</h1>
        <section className={styles.searchSection}>
          <div className=" container__content">
            <SearchForm
              variant="light"
              onSearch={onSearch}
              setLoadingShow={setLoading}
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
            headers={['Currently playing']}
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
            headers={['Upcoming']}
            useH2Headers
          />
        ) : (
          <></>
        )}
        {!currentlyPlayingShows?.length && !upcomingShows?.length ? (
          <div className={'container__content'}>No shows found</div>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
}

SearchPage.layout = Layouts.default;
