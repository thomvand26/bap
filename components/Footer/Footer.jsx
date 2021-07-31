import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { ABOUT, LANDING, SEARCH } from '@/routes';
import { Logo } from '../Logo/Logo';

import styles from './Footer.module.scss';

export const Footer = () => {
  const router = useRouter();
  const { t } = useTranslation(['navigation']);

  return (
    <footer className={`container ${styles.container}`}>
      <div className={`container__content ${styles.content}`}>
        <div className={styles.info}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.about}>{t('navigation:info')}</div>
        </div>
        <ul className={styles.navigation}>
          <li className={router.pathname === SEARCH ? 'active' : ''}>
            <Link href={SEARCH}>{t('navigation:shows')}</Link>
          </li>
          <li className={router.pathname === ABOUT ? 'active' : ''}>
            <Link href={ABOUT}>{t('navigation:about')}</Link>
          </li>
          <li className={router.pathname === LANDING ? 'active' : ''}>
            <Link href={LANDING}>{t('navigation:cookies-privacy')}</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
