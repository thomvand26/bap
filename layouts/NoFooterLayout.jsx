import Head from 'next/head';

import { Header } from '@/components';
import { appConfig } from '@/config';

import styles from './NoFooter.module.scss';

export const NoFooterLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>{appConfig.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>{children}</main>
    </div>
  );
};
