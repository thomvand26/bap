import React, { useState } from 'react';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { appConfig } from '@/config';
import { ShowList, SearchForm } from '@/components';
import { useShow } from '@/context';
import { Layouts } from '@/layouts';
import { CREATE_SHOW } from '@/routes';

import styles from './ArtistDashboardPage.module.scss';

export default function ArtistDashboardPage() {
  const { setCurrentShow, ownShows, setOwnShows } = useShow();
  const [loadingShows, setLoadingShows] = useState();
  const { t } = useTranslation(['artist-dashboard-page', 'shows']);

  const onSearch = ({ currentlyPlayingShows, upcomingShows }) => {
    setOwnShows([...currentlyPlayingShows, ...upcomingShows]);
  };

  return (
    <div className={`page container`}>
      <Head>
        <title>{`${appConfig.appName} - ${t(
          'artist-dashboard-page:page-title'
        )}`}</title>
      </Head>
      <div className="container__content">
        <h1 className={`page__title ${styles.pageTitle}`}>
          {t('artist-dashboard-page:page-title')}
        </h1>
        <Link href={CREATE_SHOW}>
          <a
            className={`button ${styles.createShowButton}`}
            onClick={() => setCurrentShow(null)}
          >
            {t('shows:new-show')}
          </a>
        </Link>
        <SearchForm
          artistDashboard
          setLoadingShows={setLoadingShows}
          onSearch={onSearch}
        />
        <ShowList
          shows={ownShows}
          variant="artistDashboard"
          headers={[
            t('artist-dashboard-page:table-show-name'),
            t('artist-dashboard-page:table-date'),
            t('artist-dashboard-page:table-actions'),
          ]}
          loading={loadingShows}
          inDashboard
          noShowsPlaceholder={t('shows:no-shows-found')}
        />
      </div>
    </div>
  );
}

ArtistDashboardPage.layout = Layouts.default;
ArtistDashboardPage.isProtected = true;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'artist-dashboard-page',
        'auth',
        'navigation',
        'shows',
        'cookies',
        'common',
      ])),
    },
  };
}
