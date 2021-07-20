import Head from 'next/head';

import { Header, SettingsSidebar, Footer } from '@/components';
import { appConfig } from '@/config';

import styles from './settingsLayout.module.scss';

export const SettingsLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>{appConfig.appName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
        <SettingsSidebar />
        {children}
      </main>

      <Footer />
    </div>
  );
};
