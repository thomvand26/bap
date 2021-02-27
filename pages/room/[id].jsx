import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from '../../context';
import { LANDING } from '../../routes';
import { Chat } from '../../components';

import styles from './room.module.scss';

export default function RoomPage(params) {
  const router = useRouter();
  const { id } = router.query;
  const { joinRoom, currentRoom } = useSession();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // console.log(id);
    joinRoom(id, (response) => {
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
    <div className={`${styles.page} ${styles.pageError}`}>
      <h2>Error: room not found</h2>
      <Link href={`${LANDING}`}>
        <button>Go back</button>
      </Link>
    </div>
  ) : (
    <div className={styles.page}>
      <div className={styles.showInfo}>
        <h2>Welcome to room {id}</h2>
        <h3>Watchers: {currentRoom?.clientIds?.length}</h3>
      </div>
      <Chat />
    </div>
  );
}
