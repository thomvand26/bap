import Head from 'next/head';
import styles from './showLayout.module.scss';

export const ShowLayout = ({children}) => {
  return (
    <div className={styles.page}>
      <Head>
        <title>ROOM BAP-Thomvand26</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className={styles.main}> */}
      <main>{children}</main>
    </div>
  )
}