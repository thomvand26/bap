import React, { useEffect, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdArrowDropDown } from 'react-icons/md';
import { useTranslation } from 'next-i18next';

import { ARTIST_DASHBOARD, LANDING, SETTINGS } from '@/routes';

import styles from './Dropdown.module.scss';

export const UserDropdown = ({ className }) => {
  const [session] = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef();
  const router = useRouter();
  const { t } = useTranslation(['auth', 'navigation']);

  useEffect(() => {
    const handleRouteChange = () => setOpen(false);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleLogout = () => {
    signOut();
    router.push(LANDING);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ''}`}
      onBlur={(event) => {
        if (!containerRef.current.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        className={`button--noMinHeight button--fit ${styles.toggleButton} ${
          open ? styles['toggleButton--open'] : ''
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{session?.user?.username}</span>
        <MdArrowDropDown
          className={`dropdownIcon ${open ? 'open' : ''}`}
          viewBox="6 6 12 12"
        />
      </button>
      <ul className={`${styles.menu} ${open ? styles['menu--open'] : ''}`}>
        <li className={router.pathname === ARTIST_DASHBOARD ? 'active' : ''}>
          <Link href={ARTIST_DASHBOARD}>
            {t('navigation:artist-dashboard')}
          </Link>
        </li>
        <li className={router.pathname === SETTINGS ? 'active' : ''}>
          <Link href={SETTINGS}>{t('auth:settings')}</Link>
        </li>
        <li>
          <button className={`button--unstyled`} onClick={handleLogout}>
            {t('auth:logout')}
          </button>
        </li>
      </ul>
    </div>
  );
};
