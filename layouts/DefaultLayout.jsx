import Head from 'next/head';
import styles from './defaultLayout.module.scss';

export const DefaultLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>BAP-Thomvand26</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className={styles.main}> */}
      <main>{children}</main>
    </div>
  );
};
