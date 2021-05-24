import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

import { useShow, useDatabase } from '@/context';
import { ShowPerformanceDashboard } from '@/components';
import { EDIT_SHOW } from '@/routes';

import styles from './performShow.module.scss';

export default function PerformShowPage() {
  const { currentShow, setCurrentShow, joinShow } = useShow();
  const { getShow } = useDatabase();
  const router = useRouter();
  const [defaultShowData, setDefaultShowData] = useState();
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

    // joinShow(showId, (response) => {
    //   if (response?.type === 'success') {
    //     setDefaultShowData(response.data);
    //     // setCurrentShow(response.data);
    //     setLoadingShow(false);
    //   }
    //   console.log(response);
    // });

    // (async () => {
    //   if (!session) return;

    //   if (currentShow?._id === showId) {
    //     setDefaultShowData(currentShow);
    //     setLoadingShow(false);
    //     return;
    //   }

    //   // const show = await getShow(showId);

    //   // if (session.user._id !== show?.owner?._id) {
    //   //   router.push(CREATE_SHOW);
    //   //   return;
    //   // }

    //   // setDefaultShowData(show);
    //   // setLoadingShow(false);
    //   // setCurrentShow(show);
    // })();
  }, [router.isReady, router.query, session]);

  return (
    <div className={styles.page}>
      <Link href={{ pathname: EDIT_SHOW, query: router.query }}>
        <a className={`button button--fit ${styles.viewButton}`}>
          Go to settings view
        </a>
      </Link>
      <ShowPerformanceDashboard
        show={defaultShowData}
        loadingShow={loadingShow}
      />
    </div>
  );
}
