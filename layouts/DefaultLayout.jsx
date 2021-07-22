import Head from 'next/head';

import { Header, Footer } from '@/components';
import { appConfig } from '@/config';

import styles from './DefaultLayout.module.scss';

export const DefaultLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>{appConfig.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>{children}</main>

      <Footer />
    </div>
  );
};
