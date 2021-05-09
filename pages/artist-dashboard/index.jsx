import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import Link from 'next/link';

import { ShowList } from '@/components';
import { useDatabase } from '@/context';
import { Layouts } from '@/layouts';
import { CREATE_SHOW } from '@/routes';

import styles from './artistDashboardPage.module.scss';

export default function ArtistDashboardPage() {
  const [session, loading] = useSession();
  const { getShows } = useDatabase();
  const [ownShows, setOwnShows] = useState();

  useEffect(() => {
    if (loading) return;
    
    const userId = session?.user?._id;
    
    if (!userId) {
      console.log('no user id, user not logged in?');
      return;
    }

    (async () => {
      const response = await getShows({owner: userId});
      setOwnShows(response);
    })()
  }, [session, loading]);

  return (
    <div className="page">
      <h2 className="pageHeader">Artist Dashboard</h2>
      <Link href={CREATE_SHOW}>
        <a className={`button ${styles.createShowButton}`}>New show</a>
      </Link>
      <ShowList shows={ownShows} variant="artistDashboard" headers={['Show name', 'Date', 'Actions']} />
    </div>
  );
}

ArtistDashboardPage.layout = Layouts.default;
