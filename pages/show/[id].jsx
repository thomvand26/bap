import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { appConfig } from '@/config';
import { useShow, useCookies, useSocket } from '@/context';
import { Layouts } from '@/layouts';
import { Chat, LoadingSpinner, PollWindow } from '@/components';

import styles from './ShowPage.module.scss';

export default function ShowPage(params) {
  const router = useRouter();
  const { id } = router.query;
  const { joinShow, currentShow, loadingShow, setLoadingShow } = useShow();
  const [session, loadingSession] = useSession();
  const { t } = useTranslation(['show-page']);
  const { cookieValues, setCookieValues } = useCookies();
  const { socket } = useSocket();

  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (!id || loadingSession || !session?.user?._id || !socket?.id || loading)
      return;
    setLoadingShow(true);
    setLoading(true);

    (async () => {
      const response = await joinShow({ showId: id });
      if (!response || response?.type === 'error') {
        router.push('/404');
      }
      setLoadingShow(false);
      setLoading(false);
    })();
  }, [id, loadingSession, socket?.id]);

  useEffect(() => {
    setUrlValid(currentShow?.streamURL);
  }, [currentShow?.streamURL]);

  return (
    <>
      <Head>
        <title>{`${appConfig.appName}${
          currentShow?.title ? ` - ${currentShow?.title}` : ''
        }`}</title>
      </Head>
      {loadingShow ? (
        <LoadingSpinner />
      ) : (
        <div className={`scrollbars--dark ${styles.page}`}>
          <div className={styles.showStream}>
            {urlValid ? (
              cookieValues?.youtube === true ? (
                <ReactPlayer
                  url={
                    currentShow?.streamURL?.includes?.('youtube.') ||
                    currentShow?.streamURL?.includes?.('youtu.be')
                      ? currentShow.streamURL
                      : null
                  }
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
                <div className="centeredPlaceholder centeredPlaceholder--withButton centeredPlaceholder--withPadding">
                  {t('cookies:youtube-cookies-needed')}
                  <button
                    type="button"
                    className="button--primary"
                    onClick={() =>
                      setCookieValues((prev) => ({ ...prev, youtube: true }))
                    }
                  >
                    {t('cookies:youtube-cookies-allow')}
                  </button>
                </div>
              )
            ) : (
              <div className="centeredPlaceholder">
                {t('show-page:stream-unavailable')}
              </div>
            )}
            <PollWindow />
          </div>
          <Chat />
        </div>
      )}
    </>
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
        'cookies',
      ])),
    },
  };
}
