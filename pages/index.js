import { useSession } from 'next-auth/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { ShowList } from '@/components';
import { Layouts } from '@/layouts';
import { LOGIN } from '@/routes';
import { useDatabase, useShow } from '@/context';
import { upsertDocumentInArrayState, filterShowsPlayingNow } from '@/utils';

// import styles from './index.module.scss';

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
        endDate: {
          $gt: currentDate,
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
    <div className="page">
      <h2 className="pageHeader">Shows</h2>
      <ShowList
        shows={filterShowsPlayingNow({
          shows: fetchedShows,
          onlyVisible: true,
        })}
      />
    </div>
  );
}

HomePage.layout = Layouts.default;
