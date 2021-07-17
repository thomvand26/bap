import { useSession } from 'next-auth/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { ShowList, LoadingSpinner } from '@/components';
import { Layouts } from '@/layouts';
import { LOGIN } from '@/routes';
import { useDatabase, useShow } from '@/context';
import { upsertDocumentInArrayState, filterShowsPlayingNow } from '@/utils';

import styles from './index.module.scss';

export default function HomePage() {
  const [session, loading] = useSession();
  const { getShows } = useDatabase();
  const { setCurrentShow, fetchedShows, setFetchedShows } = useShow();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return;
    if (!session || !session?.user?._id) router.push(LOGIN);
  }, [session]);

  useEffect(() => {
    if (loading) return;
    setCurrentShow(null);

    const userId = session?.user?._id;

    if (!userId) {
      console.log('no user id, user not logged in?');
      return;
    }

    (async () => {
      const currentDate = new Date().toISOString();

      const response = await getShows({
        startDate: {
          $lt: currentDate,
        },
        visible: true,
      });

      upsertDocumentInArrayState({
        setFunction: setFetchedShows,
        documentsArray: response,
      });
    })();
  }, [session, loading]);

  return (
    <div className="page container">
      {/* <h2 className="pageHeader">Shows</h2> */}
      <section className={`container__content ${styles.section}`}>
        <ShowList
          headers={['Currently playing']}
          shows={filterShowsPlayingNow({
            shows: fetchedShows,
            onlyVisible: true,
          }).slice(0, 3)}
          cards
          isOnHome
          withBrowseAllButton
        />
      </section>
      <section className={`container__content ${styles.section}`}>
        <ShowList
          headers={['Upcoming shows']}
          // TODO: NOT now playing
          shows={fetchedShows.filter((show) => show?.visible).slice(0, 3)}
          isOnHome
          withBrowseAllButton
          variant="upcoming"
        />
      </section>
    </div>
  );
}

HomePage.layout = Layouts.default;
