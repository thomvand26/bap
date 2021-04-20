import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LANDING } from '../../routes';
import { Chat } from '../../components';

import styles from './show.module.scss';
import { Layouts } from '../../layouts';
import { useShow } from '@/context';

export default function ShowPage(params) {
  const router = useRouter();
  const { id } = router.query;
  const { joinShow, currentShow } = useShow();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // console.log(id);
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
      <div className={styles.showInfo}>
        <h2>Welcome to room {id}</h2>
        <h3>Watchers: {currentShow?.clientIds?.length}</h3>
      </div>
      <Chat />
    </div>
  );
}

ShowPage.layout = Layouts.room;
