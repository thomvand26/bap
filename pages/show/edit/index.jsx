import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

import { Layouts } from '@/layouts';
import { useShow, useDatabase } from '@/context';
import { ShowSettingsDashboard } from '@/components';
import { CREATE_SHOW } from '@/routes';
import { PERFORM_SHOW } from '@/routes';

import styles from './EditShowPage.module.scss';

export default function EditShowPage() {
  const { currentShow, setCurrentShow, setLoadingShow } = useShow();
  const { getShow } = useDatabase();
  const router = useRouter();
  const [session, loadingSession] = useSession();
  const [isNewShow, setIsNewShow] = useState();

  useEffect(() => {
    if (!router.isReady) return;
    setLoadingShow(true);
    setIsNewShow(false);

    const { showId } = router.query;

    if (!showId) {
      setLoadingShow(false);
      setIsNewShow(true);
      return;
    }

    (async () => {
      if (!session) return;

      // Use current show if it's the requested show
      if (currentShow?._id === showId) {
        setLoadingShow(false);
        return;
      }

      setCurrentShow(null);

      // Get the show
      const show = await getShow(showId);
      console.log(show);

      // If the show doesn't exist yet, go to the create page
      if (session.user._id !== show?.owner?._id) {
        router.push(CREATE_SHOW);
        return;
      }

      setLoadingShow(false);

      // Set the currentShow
      setCurrentShow(show);
    })();
  }, [router.isReady, router.query, session, loadingSession]);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>{currentShow?.title}</h1>
        <Link href={{ pathname: PERFORM_SHOW, query: router.query }}>
          <a className={`button button--fit`}>Go to performance view</a>
        </Link>
      </div>
      <ShowSettingsDashboard isNewShow={isNewShow} />
    </div>
  );
}

EditShowPage.layout = Layouts.noFooter;
