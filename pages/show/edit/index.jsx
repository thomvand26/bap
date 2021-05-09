import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import styles from './createShow.module.scss';
import { useShow, useDatabase } from '@/context';
import { ShowSettingsDashboard } from '@/components';
import { CREATE_SHOW } from '@/routes';
import { useSession } from 'next-auth/client';

export default function CreateShowPage() {
  const { setCurrentShow } = useShow();
  const { getShow } = useDatabase();
  const router = useRouter();
  const [defaultShowData, setDefaultShowData] = useState();
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
      <ShowSettingsDashboard show={defaultShowData} loadingShow={loadingShow} />
    </div>
  );
}
