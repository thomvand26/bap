import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { encode } from 'querystring';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import {
  dateBetweenShowDatesMongoDBQuery,
  filterShowsPlayingNow,
} from '@/utils';
import { useDatabase } from '@/context';
import { Input } from '@/components';
import { Searchbar } from './Searchbar';

import styles from './SearchForm.module.scss';
import { useSession } from 'next-auth/client';

const validationSchema = Yup.object().shape({
  search: Yup.string().nullable(true),
  date: Yup.date().nullable(true),
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
  const [session] = useSession();
  const { t } = useTranslation(['shows']);

  const [loading, setLoading] = useState();

  useEffect(() => {
    if (!router.isReady) return;

    // Search shows (format from router query)
    searchShows?.({
      ...router?.query,
      ...(router?.query?.currentlyPlaying
        ? { currentlyPlaying: JSON.parse(router.query.currentlyPlaying) }
        : {}),
    });
  }, [router.isReady]);

  async function searchShows(data) {
    if (loading) return;
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
      ...(artistDashboard ? { owner: session?.user?._id } : {}),
      ...(data?.search
        ? { title: { $regex: data.search, $options: 'i' } }
        : {}),
      ...(data?.currentlyPlaying === true
        ? dateBetweenShowDatesMongoDBQuery({ dateObject: new Date() })
        : data?.currentlyPlaying === false
        ? { startDate: { $gt: new Date() } }
        : {}),
      ...(!artistDashboard ? { public: true } : {}),
    };

    // Join the query
    query = { $and: [query, date, { endDate: { $gte: new Date() } }] };

    const response = await getShows(query);

    // Filter and set separate show groups
    const { currentlyPlayingShows: currentlyPlaying, upcomingShows: upcoming } =
      filterShowsPlayingNow({
        shows: response,
        onlyPublic: !artistDashboard,
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
        currentlyPlaying: router?.query?.currentlyPlaying
          ? JSON.parse(router?.query?.currentlyPlaying)
          : null,
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <fieldset className={styles.fieldset} disabled={loading}>
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
                name="currentlyPlaying"
                label={t('shows:currently-playing')}
                type="select"
                variant={variant}
                options={[
                  { label: t('shows:all'), value: null },
                  { label: t('shows:currently-playing'), value: true },
                  { label: t('shows:upcoming-shows'), value: false },
                ]}
                submitOnChange
                noPaddingBottom
              />
            </div>
          )}
        </fieldset>
      </Form>
    </Formik>
  );
};
