import { LANDING } from '@/routes';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import React from 'react';
import styles from './header.module.scss';
import { UserDropdown } from './UserDropdown';

export const Header = () => {
  const [session] = useSession();

  console.log(session);

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        {!session ? (
          <>
            <ul className={styles.right}>
              <li>
                <Link href={LANDING}>Home</Link>
              </li>
              <li>
                <Link href={LANDING}>About</Link>
              </li>
              <li>
                <Link href={LANDING}>Features</Link>
              </li>
              <li>
                <Link href={LANDING}>Shows</Link>
              </li>
              <li>
                <Link href={LANDING}>Contact</Link>
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul className={styles.left}>
              <li>
                <Link href={LANDING}>Home</Link>
              </li>
            </ul>
            <div className={styles.search}>SEARCH</div>
            <div className={styles.right}>
              <UserDropdown />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
