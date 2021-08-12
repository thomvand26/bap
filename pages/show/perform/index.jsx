import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { appConfig } from '@/config';
import { Layouts } from '@/layouts';
import { useShow } from '@/context';
import { ShowPerformanceDashboard } from '@/components';
import { CREATE_SHOW, EDIT_SHOW } from '@/routes';

import styles from './PerformShowPage.module.scss';

export default function PerformShowPage() {
  const { currentShow, joinShow, loadingShow, setLoadingShow } = useShow();
  const router = useRouter();
  const [session, loadingSession] = useSession();
  const { t } = useTranslation(['artist-dashboard']);

  useEffect(() => {
    if (!router.isReady) return;
    if (!session?.user?._id) return;
    setLoadingShow(true);

    const { showId } = router.query;

    if (!showId) {
      router.push(CREATE_SHOW);
      setLoadingShow(false);
      return;
    }

    (async () => {
      const response = await joinShow({ showId, mustBeOwner: true });
      if (!response) {
        router.push(CREATE_SHOW);
        return;
      }
      setLoadingShow(false);
    })();
  }, [router.isReady, router.query, loadingSession]);

  return (
    <div className={styles.page}>
      <Head>
        <title>{`${appConfig.appName} - ${t('artist-dashboard:perform-show')}${
          currentShow?.title ? ` - ${currentShow?.title}` : ''
        }`}</title>
      </Head>
      <div className={styles.top}>
        <h1 className={styles.title}>{currentShow?.title}</h1>
        <Link href={{ pathname: EDIT_SHOW, query: router.query }}>
          <a className={`button button--fit`}>
            {t('artist-dashboard:go-to-settings')}
          </a>
        </Link>
      </div>
      <ShowPerformanceDashboard loadingShow={loadingShow} />
    </div>
  );
}

PerformShowPage.layout = Layouts.noFooter;
PerformShowPage.isProtected = true;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'auth',
        'navigation',
        'shows',
        'common',
        'artist-dashboard',
        'chat',
        'cookies',
      ])),
    },
  };
}
