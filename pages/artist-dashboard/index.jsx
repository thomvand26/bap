import React, { useState } from 'react';
import Link from 'next/link';

import { ShowList, SearchForm } from '@/components';
import { useShow } from '@/context';
import { Layouts } from '@/layouts';
import { CREATE_SHOW } from '@/routes';

import styles from './ArtistDashboardPage.module.scss';

export default function ArtistDashboardPage() {
  const { setCurrentShow, ownShows, setOwnShows } = useShow();
  const [loadingShows, setLoadingShows] = useState(true);

  const onSearch = ({ currentlyPlayingShows, upcomingShows }) => {
    setOwnShows([...currentlyPlayingShows, ...upcomingShows]);
  };

  return (
    <div className={`page container`}>
      <div className="container__content">
        <h2 className="page__title">Artist Dashboard</h2>
        <Link href={CREATE_SHOW}>
          <a
            className={`button ${styles.createShowButton}`}
            onClick={() => setCurrentShow(null)}
          >
            New show
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
          headers={['Show name', 'Date', 'Actions']}
          loading={loadingShows}
          inDashboard
        />
      </div>
    </div>
  );
}

ArtistDashboardPage.layout = Layouts.default;
