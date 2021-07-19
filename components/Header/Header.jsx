import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';

import { Logo } from '@/components';
import { ABOUT, LANDING, LOGIN, REGISTER, SEARCH } from '@/routes';
import { UserDropdown } from './UserDropdown';

import styles from './header.module.scss';
import { useRouter } from 'next/router';
import { MdNotificationsNone } from 'react-icons/md';

export const Header = () => {
  const [session] = useSession();
  const router = useRouter();

  return (
    <div className={styles.header}>
      <div
        className={`${styles.inner} ${
          !session ? styles['inner--visitor'] : ''
        }`}
      >
        <div className={styles.homeLink}>
          <Link href={LANDING}>
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        {!session ? (
          <>
            <ul className={styles.col}>
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
            </ul>
            <div className={styles.col}>
              <Link
                href={
                  router?.asPath?.startsWith(`${REGISTER}`) ? LOGIN : REGISTER
                }
              >
                <a
                  className={`button button--fit button--noMinHeight button--ghost ${styles.headerCTAButton}`}
                >
                  {router?.asPath?.startsWith(`${REGISTER}`)
                    ? 'Login'
                    : 'Register'}
                </a>
              </Link>
            </div>
          </>
        ) : (
          <div className={styles.right}>
            <ul className={styles.col}>
              <li>
                <Link href={SEARCH}>Find shows</Link>
              </li>
              <li>
                <Link href={ABOUT}>About</Link>
              </li>
            </ul>
            <button className={`button--icon ${styles.notificationButton}`}>
              <MdNotificationsNone size="30px" />
            </button>
            <UserDropdown />
          </div>
        )}
      </div>
    </div>
  );
};
