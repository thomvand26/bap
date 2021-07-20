import React, { useState } from 'react';
import Link from 'next/link';

import { ShowList } from '@/components';
import { useShow } from '@/context';
import { Layouts } from '@/layouts';
import { CREATE_SHOW } from '@/routes';

import styles from './artistDashboardPage.module.scss';
import { SearchForm } from '@/components/Search/SearchForm';

export default function ArtistDashboardPage() {
  const { setCurrentShow, ownShows, setOwnShows } = useShow();
  const [loadingShows, setLoadingShows] = useState(true);

  const onSearch = ({ currentlyPlayingShows, upcomingShows }) => {
    setOwnShows([...currentlyPlayingShows, ...upcomingShows]);
  };

  return (
    <div className={`page container ${styles.page}`}>
      <div className="container__content">
        <h2 className="pageHeader">Artist Dashboard</h2>
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
        />
      </div>
    </div>
  );
}

ArtistDashboardPage.layout = Layouts.default;
