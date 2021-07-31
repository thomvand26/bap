import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Chat, LoadingSpinner, PollWindow } from '@/components';
import { Layouts } from '@/layouts';
import { useShow } from '@/context';

import styles from './ShowPage.module.scss';

export default function ShowPage(params) {
  const router = useRouter();
  const { id } = router.query;
  const { joinShow, currentShow, loadingShow, setLoadingShow } = useShow();
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);
  const [session, loadingSession] = useSession();
  const { t } = useTranslation(['show-page']);

  useEffect(() => {
    if (!id || loadingSession) return;

    setLoadingShow(true);

    joinShow(id, (response) => {
      if (response?.type === 'error') {
        console.log('error');
        router.push('/404');
      } else {
        console.log('success');
      }

      setLoadingShow(false);
    });
  }, [id, loadingSession]);

  useEffect(() => {
    setUrlValid(currentShow?.streamURL);
  }, [currentShow?.streamURL]);

  return loadingShow ? (
    <LoadingSpinner />
  ) : (
    <div className={`scrollbars--dark ${styles.page}`}>
      <div className={styles.showStream}>
        {urlValid ? (
          <ReactPlayer
            url={currentShow?.streamURL}
            width="100%"
            height="100%"
            onError={() => {
              setUrlValid(false);
            }}
            controls={true}
            playing={true}
            config={{
              youtube: {
                playerVars: {
                  autoplay: true,
                },
              },
            }}
          />
        ) : (
          <div className="centeredPlaceholder">
            {t('show-page:stream-unavailable')}
          </div>
        )}
        <PollWindow />
      </div>
      <Chat />
    </div>
  );
}

ShowPage.layout = Layouts.room;
ShowPage.isProtected = true;

export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'show-page',
        'common',
        'chat',
      ])),
    },
  };
}
