import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { encode } from 'querystring';
import { useRouter } from 'next/router';

import {
  dateBetweenShowDatesMongoDBQuery,
  filterShowsPlayingNow,
} from '@/utils';
import { useDatabase } from '@/context';
import { Input } from '@/components';
import { Searchbar } from './Searchbar';

import styles from './searchForm.module.scss';

const validationSchema = Yup.object().shape({
  search: Yup.string().nullable(true),
  date: Yup.date().nullable(true),
  reminded: Yup.boolean().nullable(true), // null = all, true = with reminder, false = without reminder
  currentlyPlaying: Yup.boolean().nullable(true), // null = all, true = currently playing, false = upcoming
});

export const SearchForm = ({
  searchShows,
  artistDashboard,
  variant,
  setLoadingShows,
  onSearch,
}) => {
  const router = useRouter();
  const { getShows } = useDatabase();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    // Search shows (format from router query)
    searchShows?.({
      ...router?.query,
      ...(router?.query?.reminded
        ? { reminded: JSON.parse(router.query.reminded) }
        : {}),
      ...(router?.query?.currentlyPlaying
        ? { currentlyPlaying: JSON.parse(router.query.currentlyPlaying) }
        : {}),
    });
  }, [router.isReady]);

  async function searchShows(data) {
    setLoading(true);
    setLoadingShows?.(true);

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
        onlyVisible: !artistDashboard,
      });

    onSearch({
      currentlyPlayingShows: currentlyPlaying,
      upcomingShows: upcoming,
    });

    setLoading(false);
    setLoadingShows?.(false);
  }

  const handleSubmit = (data) => {
    searchShows?.(data);
    router.push(`${router.pathname}?${encode(data)}`);
  };

  return (
    <Formik
      validationSchema={validationSchema}
      enableReinitialize={true}
      initialValues={{
        search: router?.query?.search || '',
        date: router?.query?.date || null,
        reminded: router?.query?.reminded
          ? JSON.parse(router?.query?.reminded)
          : null,
        currentlyPlaying: router?.query?.currentlyPlaying
          ? JSON.parse(router?.query?.currentlyPlaying)
          : null,
      }}
      onSubmit={handleSubmit}
    >
      <Form className={`${styles.form}`}>
        <Searchbar
          className={`${styles.searchGroup} ${
            artistDashboard ? styles['searchGroup--artistDashboard'] : ''
          }`}
          artistDashboard={artistDashboard}
          variant={variant}
        />
        {!artistDashboard && (
          <div className={`${styles.filterGroup}`}>
            <Input
              name="reminded"
              label="Reminded"
              type="select"
              variant={variant}
              options={[
                { label: 'All', value: null },
                { label: 'With reminder', value: true },
                { label: 'Without reminder', value: false },
              ]}
              submitOnChange
              noPaddingBottom
            />
            <Input
              name="currentlyPlaying"
              label="Currently playing"
              type="select"
              variant={variant}
              options={[
                { label: 'All', value: null },
                { label: 'Currently playing', value: true },
                { label: 'Upcoming', value: false },
              ]}
              submitOnChange
              noPaddingBottom
            />
          </div>
        )}
      </Form>
    </Formik>
  );
};
