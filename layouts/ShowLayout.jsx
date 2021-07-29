import Head from 'next/head';

import { appConfig } from '@/config';

import styles from './ShowLayout.module.scss';

export const ShowLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>ROOM {appConfig.appName}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#ff7700"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ff7700" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ff7700" />
      </Head>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
