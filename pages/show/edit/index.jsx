import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

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
  const [fetching, setFetching] = useState();
  const { t } = useTranslation(['artist-dashboard']);

  useEffect(() => {
    if (!router.isReady) return;
    if (!session?.user?._id) return;
    if (fetching) return;
    setLoadingShow(true);
    setIsNewShow(false);

    const { showId } = router.query;

    if (!showId) {
      setLoadingShow(false);
      setIsNewShow(true);
      return;
    }

    (async () => {
      // Use current show if it's the requested show and user is owner
      if (
        currentShow?._id === showId &&
        currentShow?.owner?._id !== session.user._id
      ) {
        setLoadingShow(false);
        return;
      }

      setCurrentShow(null);

      // Get the show
      setFetching(true);
      const show = await getShow(showId);
      setFetching(false);
      console.log(show);

      // If the show doesn't exist yet, or user is not the owner go to the create page
      if (show?.owner?._id !== session.user._id) {
        router.push(CREATE_SHOW);
        return;
      }

      setLoadingShow(false);

      // Set the currentShow
      setCurrentShow(show);
    })();
  }, [router.isReady, router.query, session, loadingSession, currentShow]);

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <h1 className={styles.title}>{currentShow?.title}</h1>
        <Link href={{ pathname: PERFORM_SHOW, query: router.query }}>
          <a className={`button button--fit`}>
            {t('artist-dashboard:go-to-performance')}
          </a>
        </Link>
      </div>
      <ShowSettingsDashboard isNewShow={isNewShow} />
    </div>
  );
}

EditShowPage.layout = Layouts.noFooter;
EditShowPage.isProtected = true;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'auth',
        'navigation',
        'shows',
        'common',
        'artist-dashboard',
        'cookies',
      ])),
    },
  };
}
