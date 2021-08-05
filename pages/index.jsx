import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ShowList, LandingPage } from '@/components';
import { Layouts } from '@/layouts';
import { useDatabase, useShow } from '@/context';
import { upsertDocumentInArrayState, filterShowsPlayingNow } from '@/utils';

import styles from './HomePage.module.scss';

export default function HomePage(props) {
  const [session, loading] = useSession();
  const { getShows } = useDatabase();
  const { setCurrentShow, fetchedShows, setFetchedShows } = useShow();
  const { t } = useTranslation(['home-page', 'shows']);
  const [isFetching, setIsFetching] = useState();
  const [groupedShows, setGroupedShows] = useState();

  useEffect(() => {
    if (loading) return;
    setIsFetching(true);
    setCurrentShow(null);

    const userId = session?.user?._id;

    if (!userId) {
      console.log('no user id, user not logged in?');
      return;
    }

    (async () => {
      const response = await getShows({
        endDate: {
          $gte: new Date(),
        },
        public: true,
      });

      upsertDocumentInArrayState({
        setFunction: setFetchedShows,
        documentsArray: response,
      });

      setIsFetching(false);
    })();
  }, [session, loading]);

  useEffect(() => {
    // Filter and set separate show groups
    setGroupedShows(
      filterShowsPlayingNow({
        shows: fetchedShows,
        onlyPublic: true,
      })
    );
  }, [fetchedShows]);

  return session?.user?._id ? (
    <div className="page container">
      <div className={`container__content ${styles.top}`}>
        <h1 className={styles.top__title}>{t('home-page:page-title')}</h1>
        <p className={styles.top__intro}>{t('home-page:intro')}</p>
      </div>
      <section className={`container__content ${styles.section}`}>
        <ShowList
          headers={[t('shows:currently-playing')]}
          shows={groupedShows?.currentlyPlayingShows.slice(0, 3)}
          cards
          loading={isFetching}
          isOnHome
          withBrowseAllButton
        />
      </section>
      <section className={`container__content ${styles.section}`}>
        <ShowList
          headers={[t('shows:upcoming-shows')]}
          shows={groupedShows?.upcomingShows.slice(0, 3)}
          isOnHome
          withBrowseAllButton
          variant="upcoming"
        />
      </section>
    </div>
  ) : (
    <LandingPage />
  );
}

HomePage.layout = Layouts.default;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'home-page',
        'landing-page',
        'auth',
        'navigation',
        'shows',
        'cookies',
        'common',
      ])),
    },
  };
}
