import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

import { useShow } from '@/context';
import { ShowPerformanceDashboard } from '@/components';
import { EDIT_SHOW } from '@/routes';

import styles from './performShow.module.scss';

export default function PerformShowPage() {
  const { currentShow, joinShow } = useShow();
  const router = useRouter();
  const [loadingShow, setLoadingShow] = useState(true);
  const [session] = useSession();

  useEffect(() => {
    if (!router.isReady) return;
    if (!loadingShow) return;

    const { showId } = router.query;

    if (!showId) {
      setLoadingShow(false);
      return;
    }

    joinShow(showId, () => {
      setLoadingShow(false);
    });
  }, [router.isReady, router.query, session]);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1>{currentShow?.title}</h1>
        <Link href={{ pathname: EDIT_SHOW, query: router.query }}>
          <a className={`button button--fit`}>Go to settings view</a>
        </Link>
      </div>
      <ShowPerformanceDashboard loadingShow={loadingShow} />
    </div>
  );
}
