import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ShowList } from '@/components';
import { Layouts } from '@/layouts';
import { LOGIN } from '@/routes';
import { useDatabase, useShow } from '@/context';
import { upsertDocumentInArrayState, filterShowsPlayingNow } from '@/utils';

import styles from './HomePage.module.scss';

export default function HomePage() {
  const [session, loading] = useSession();
  const { getShows } = useDatabase();
  const { setCurrentShow, fetchedShows, setFetchedShows } = useShow();
  const router = useRouter();
  const [isFetching, setIsFetching] = useState();
  const [groupedShows, setGroupedShows] = useState();

  useEffect(() => {
    if (session === undefined) return;
    if (!session || !session?.user?._id) router.push(LOGIN);
  }, [session]);

  useEffect(() => {
    if (loading) return;
    setIsFetching(true);
    setCurrentShow(null);

    const userId = session?.user?._id;

    if (!userId) {
      console.log('no user id, user not logged in?');
      return;
    }

    (async () => {
      const response = await getShows({
        endDate: {
          $gte: new Date(),
        },
        visible: true,
      });

      upsertDocumentInArrayState({
        setFunction: setFetchedShows,
        documentsArray: response,
      });

      setIsFetching(false);
    })();
  }, [session, loading]);

  useEffect(() => {
    // Filter and set separate show groups
    setGroupedShows(
      filterShowsPlayingNow({
        shows: fetchedShows,
        onlyVisible: true,
      })
    );
  }, [fetchedShows]);

  return (
    <div className="page container">
      <section className={`container__content ${styles.section}`}>
        <ShowList
          headers={['Currently playing']}
          shows={groupedShows?.currentlyPlayingShows.slice(0, 3)}
          cards
          loading={isFetching}
          isOnHome
          withBrowseAllButton
        />
      </section>
      <section className={`container__content ${styles.section}`}>
        <ShowList
          headers={['Upcoming shows']}
          shows={groupedShows?.upcomingShows.slice(0, 3)}
          isOnHome
          withBrowseAllButton
          variant="upcoming"
        />
      </section>
    </div>
  );
}

HomePage.layout = Layouts.default;
