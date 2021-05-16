import Head from 'next/head';

import { appConfig } from '@/config';

import styles from './showLayout.module.scss';

export const ShowLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>ROOM {appConfig.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>
    </div>
  );
};
