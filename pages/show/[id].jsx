import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import { LANDING } from '../../routes';
import { Chat } from '../../components';

import { Layouts } from '../../layouts';
import { useShow } from '@/context';

import styles from './show.module.scss';

export default function ShowPage(params) {
  const router = useRouter();
  const { id } = router.query;
  const { joinShow, currentShow } = useShow();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);

  useEffect(() => {
    if (!id) return;
    joinShow(id, (response) => {
      if (response?.type === 'error') {
        // console.log('error');
        setError(response);
      } else {
        // console.log('success');
      }

      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    setUrlValid(currentShow?.streamURL);
  }, [currentShow?.streamURL]);

  return loading ? (
    <></>
  ) : error ? (
    <div className={`page ${styles.page} ${styles.pageError}`}>
      <h2>Error: show not found</h2>
      <Link href={`${LANDING}`}>
        <button>Go back</button>
      </Link>
    </div>
  ) : (
    <div className={styles.page}>
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
          'Invalid Stream URL.'
        )}
      </div>
      <Chat />
    </div>
  );
}

ShowPage.layout = Layouts.room;
