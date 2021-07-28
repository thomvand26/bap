import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

import { Layouts } from '@/layouts';
import { useShow } from '@/context';
import { ShowPerformanceDashboard } from '@/components';
import { EDIT_SHOW } from '@/routes';

import styles from './PerformShowPage.module.scss';

export default function PerformShowPage() {
  const { currentShow, joinShow, loadingShow, setLoadingShow } = useShow();
  const router = useRouter();
  const [session] = useSession();

  useEffect(() => {
    if (!router.isReady) return;
    setLoadingShow(true);

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
        <h1 className={styles.title}>{currentShow?.title}</h1>
        <Link href={{ pathname: EDIT_SHOW, query: router.query }}>
          <a className={`button button--fit`}>Go to settings view</a>
        </Link>
      </div>
      <ShowPerformanceDashboard loadingShow={loadingShow} />
    </div>
  );
}

PerformShowPage.layout = Layouts.noFooter;
