import Head from 'next/head';

import { Header } from '@/components';
import { appConfig } from '@/config';

import styles from './defaultLayout.module.scss';

export const NoSearchLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>{appConfig.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header noSearch />
        {children}
      </main>
    </div>
  );
};
