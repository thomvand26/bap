import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';

import { Logo } from '@/components';
import { ABOUT, LANDING, LOGIN, REGISTER, SEARCH } from '@/routes';
import { UserDropdown } from './UserDropdown';

import styles from './Header.module.scss';

export const Header = () => {
  const [session] = useSession();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState();

  useEffect(() => {
    const handleRouteChange = () => setOpenMenu(false);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <header className={styles.header}>
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
        <button
          type="button"
          className={`button--icon ${styles.menuButton}`}
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          {openMenu ? <FaTimes /> : <FaBars />}
        </button>
        <div
          className={`${styles.offScreen} ${
            openMenu ? styles['offScreen--open'] : ''
          }`}
          onClick={(event) => {
            if (event.currentTarget !== event.target) return;
            setOpenMenu(false);
          }}
        >
          <div className={`${styles.offScreen__inner}`}>
            {!session ? (
              <>
                <ul className={`${styles.col} ${styles.centerNav}`}>
                  <li className={router.pathname === LANDING ? 'active' : ''}>
                    <Link href={LANDING}>Home</Link>
                  </li>
                  <li className={router.pathname === LANDING ? 'active' : ''}>
                    <Link href={LANDING}>About</Link>
                  </li>
                  <li className={router.pathname === LANDING ? 'active' : ''}>
                    <Link href={LANDING}>Features</Link>
                  </li>
                  <li className={router.pathname === LANDING ? 'active' : ''}>
                    <Link href={LANDING}>Shows</Link>
                  </li>
                </ul>
                <div className={styles.col}>
                  <Link
                    href={
                      router?.asPath?.startsWith(`${REGISTER}`)
                        ? LOGIN
                        : REGISTER
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
                <ul className={`${styles.col} ${styles.loggedInNav}`}>
                  <li className={router.pathname === SEARCH ? 'active' : ''}>
                    <Link href={SEARCH}>Find shows</Link>
                  </li>
                  <li className={router.pathname === ABOUT ? 'active' : ''}>
                    <Link href={ABOUT}>About</Link>
                  </li>
                </ul>
                <UserDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
