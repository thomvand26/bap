import React, { useState } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { ShowList, SearchForm } from '@/components';
import { useShow } from '@/context';
import { Layouts } from '@/layouts';
import { CREATE_SHOW } from '@/routes';

import styles from './ArtistDashboardPage.module.scss';

export default function ArtistDashboardPage() {
  const { setCurrentShow, ownShows, setOwnShows } = useShow();
  const [loadingShows, setLoadingShows] = useState(true);
  const { t } = useTranslation(['artist-dashboard-page', 'shows']);

  const onSearch = ({ currentlyPlayingShows, upcomingShows }) => {
    setOwnShows([...currentlyPlayingShows, ...upcomingShows]);
  };

  return (
    <div className={`page container`}>
      <div className="container__content">
        <h2 className="page__title">{t('artist-dashboard-page:page-title')}</h2>
        <Link href={CREATE_SHOW}>
          <a
            className={`button ${styles.createShowButton}`}
            onClick={() => setCurrentShow(null)}
          >
            {t('shows:new-show')}
          </a>
        </Link>
        <SearchForm
          searchShows={(data) => console.log(data)}
          artistDashboard
          setLoadingShow={setLoadingShows}
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
        />
      </div>
    </div>
  );
}

ArtistDashboardPage.layout = Layouts.default;

export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'artist-dashboard-page',
        'auth',
        'navigation',
        'shows',
      ])),
      session: await getSession(context),
    },
  };
}
