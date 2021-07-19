import React, { useEffect } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { encode } from 'querystring';
import { useRouter } from 'next/router';

import { Input } from '@/components';
import { Searchbar } from './Searchbar';

import styles from './searchForm.module.scss';

const validationSchema = Yup.object().shape({
  search: Yup.string().nullable(true),
  date: Yup.date().nullable(true),
  reminded: Yup.boolean().nullable(true), // null = all, true = with reminder, false = without reminder
  currentlyPlaying: Yup.boolean().nullable(true), // null = all, true = currently playing, false = upcoming
});

export const SearchForm = ({ searchShows }) => {
  const router = useRouter();

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
        <Searchbar className={`${styles.searchGroup}`} />
        <div className={`${styles.filterGroup}`}>
          <Input
            name="reminded"
            label="Reminded"
            type="select"
            variant="light"
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
            variant="light"
            options={[
              { label: 'All', value: null },
              { label: 'Currently playing', value: true },
              { label: 'Upcoming', value: false },
            ]}
            submitOnChange
            noPaddingBottom
          />
        </div>
      </Form>
    </Formik>
  );
};
