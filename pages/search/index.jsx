import React, { useState } from 'react';

import { Layouts } from '@/layouts';
import { useDatabase } from '@/context';
import { SearchForm, ShowList } from '@/components';

import styles from './searchPage.module.scss';
import {
  dateBetweenShowDatesMongoDBQuery,
  filterShowsPlayingNow,
} from '@/utils';

export default function SearchPage() {
  const { getShows } = useDatabase();
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [currentlyPlayingShows, setCurrentlyPlayingShows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function searchShows(data) {
    setLoading(true);

    const dateObject = new Date(data?.date);

    // Format the date query
    const date =
      data?.date && data?.date !== ''
        ? dateBetweenShowDatesMongoDBQuery({ dateObject, isFullDay: true })
        : {};

    // Format the rest of the query
    let query = {
      ...(data?.search
        ? { title: { $regex: data.search, $options: 'i' } }
        : {}),
      // TODO: reminders
      // ...(data?.reminded ? { reminded: data.date } : {}),
      ...(data?.currentlyPlaying === true
        ? dateBetweenShowDatesMongoDBQuery({ dateObject: new Date() })
        : data?.currentlyPlaying === false
        ? { startDate: { $gt: new Date() } }
        : {}),
      visible: true,
    };

    // Join the query
    query = { $and: [query, date, { endDate: { $gte: new Date() } }] };

    const response = await getShows(query);

    // Filter and set separate show groups
    const { currentlyPlayingShows: currentlyPlaying, upcomingShows: upcoming } =
      filterShowsPlayingNow({
        shows: response,
        onlyVisible: true,
      });

    setUpcomingShows(upcoming);
    setCurrentlyPlayingShows(currentlyPlaying);

    setLoading(false);
  }

  return (
    <div>
      <div className={`container ${styles.top}`}>
        <h1>Search shows</h1>
        <section className={styles.searchSection}>
          <div className=" container__content">
            <SearchForm searchShows={searchShows} />
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
