import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

import { useShow, useDatabase } from '@/context';
import { ShowSettingsDashboard } from '@/components';
import { CREATE_SHOW } from '@/routes';
import { PERFORM_SHOW } from '@/routes';

import styles from './editShow.module.scss';

export default function CreateShowPage() {
  const { currentShow, setCurrentShow } = useShow();
  const { getShow } = useDatabase();
  const router = useRouter();
  const [defaultShowData, setDefaultShowData] = useState(); // unnecessary?
  const [loadingShow, setLoadingShow] = useState(true);
  const [session] = useSession();

  useEffect(() => {
    if (!router.isReady) return;

    const { showId } = router.query;

    if (!showId) {
      setLoadingShow(false);
      return;
    }

    (async () => {
      if (!session) return;

      if (currentShow?._id === showId) {
        setDefaultShowData(currentShow);
        setLoadingShow(false);
        return;
      }

      const show = await getShow(showId);

      if (session.user._id !== show?.owner?._id) {
        router.push(CREATE_SHOW);
        return;
      }

      setDefaultShowData(show);
      setLoadingShow(false);
      setCurrentShow(show);
    })();
  }, [router.isReady, router.query, session]);

  return (
    <div className={styles.page}>
      <Link href={{ pathname: PERFORM_SHOW, query: router.query }}>
        <a className={`button button--fit ${styles.viewButton}`}>Go to performance view</a>
      </Link>
      <ShowSettingsDashboard show={defaultShowData} loadingShow={loadingShow} />
    </div>
  );
}
