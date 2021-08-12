import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import FocusTrap from 'focus-trap-react';

import { Logo } from '@/components';
import { ABOUT, LANDING, LOGIN, REGISTER, SEARCH } from '@/routes';
import { UserDropdown } from './UserDropdown';
import { LangSwitcher } from './LangSwitcher';

import styles from './Header.module.scss';

export const Header = () => {
  const [session] = useSession();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState();
  const { t } = useTranslation(['auth', 'navigation']);

  useEffect(() => {
    const handleRouteChange = () => setOpenMenu(false);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <header className={styles.header}>
      <FocusTrap
        active={!!openMenu}
        focusTrapOptions={{ allowOutsideClick: true }}
      >
        <div
          className={`${styles.inner} ${
            !session?.user?._id ? styles['inner--visitor'] : ''
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
            aria-label={t('navigation:menu-button-aria')}
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
              {!session?.user?._id ? (
                <>
                  <ul className={`${styles.col} ${styles.centerNav}`}>
                    <li className={router.pathname === LANDING ? 'active' : ''}>
                      <Link href={LANDING}>{t('navigation:home')}</Link>
                    </li>
                    <li className={router.pathname === ABOUT ? 'active' : ''}>
                      <Link href={ABOUT}>{t('navigation:about')}</Link>
                    </li>
                  </ul>
                  <div className={`${styles.col} ${styles.right}`}>
                    <LangSwitcher className={styles.langSwitcher} />
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
                          ? t('auth:login')
                          : t('auth:register')}
                      </a>
                    </Link>
                  </div>
                </>
              ) : (
                <div className={styles.right}>
                  <ul className={`${styles.col} ${styles.loggedInNav}`}>
                    <li className={router.pathname === SEARCH ? 'active' : ''}>
                      <Link href={SEARCH}>{t('navigation:find-shows')}</Link>
                    </li>
                    <li className={router.pathname === ABOUT ? 'active' : ''}>
                      <Link href={ABOUT}>{t('navigation:about')}</Link>
                    </li>
                  </ul>
                  <LangSwitcher className={styles.langSwitcher} />
                  <UserDropdown className={styles.userDropdown} />
                </div>
              )}
            </div>
          </div>
        </div>
      </FocusTrap>
    </header>
  );
};
