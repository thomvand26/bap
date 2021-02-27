import Head from 'next/head';
import { Chat, RoomList } from '../components';
import styles from './index.module.scss';

export default function Home() {
  return (
    <div className={styles.page}>
      <Head>
        <title>BAP-Thomvand26</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className={styles.main}> */}
      <main>
        <RoomList showCreateRoomBtn />
      </main>
    </div>
  );
}
