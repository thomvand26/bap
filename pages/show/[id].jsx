import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactPlayer from 'react-player';

import { LANDING } from '@/routes';
import { Chat, LoadingSpinner } from '@/components';
import { Layouts } from '@/layouts';
import { useShow } from '@/context';

import styles from './ShowPage.module.scss';

export default function ShowPage(params) {
  const router = useRouter();
  const { id } = router.query;
  const { joinShow, currentShow, loadingShow, setLoadingShow } = useShow();
  const [error, setError] = useState();
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);
  const [session, loadingSession] = useSession();

  useEffect(() => {
    if (!id || loadingSession) return;

    setLoadingShow(true);

    joinShow(id, (response) => {
      if (response?.type === 'error') {
        console.log('error');
        setError(response);
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
  ) : error ? (
    <div className={`page ${styles.page} ${styles.pageError}`}>
      <h2>Error: show not found</h2>
      <Link href={`${LANDING}`}>
        <button>Go back</button>
      </Link>
    </div>
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
          <div className="centeredPlaceholder">Invalid Stream URL</div>
        )}
      </div>
      <Chat />
    </div>
  );
}

ShowPage.layout = Layouts.room;
