import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Logo } from '@/components';

import styles from './LandingPage.module.scss';
import { REGISTER } from '@/routes';

export const LandingPage = () => {
  const { t } = useTranslation(['landing-page', 'auth']);

  return (
    <div className={`page container ${styles.page}`}>
      <div
        className={`container__content container__content--fullText ${styles.content}`}
      >
        <div className={styles.top}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <h1 className={styles.pageTitle}>{t('landing-page:page-title')}</h1>
          <Link href={REGISTER}>
            <a
              className={`button button--fit button--noMinHeight button--ghost ${styles.registerButton}`}
            >
              {t('auth:register')}
            </a>
          </Link>
        </div>
        <p className={styles.intro}>{t('landing-page:intro')}</p>
        <div>
          <h2>{t('landing-page:song-requests-title')}</h2>
          <p>{t('landing-page:song-requests-p1')}</p>
        </div>
        <div>
          <h2>{t('landing-page:chat-title')}</h2>
          <p>{t('landing-page:chat-p1')}</p>
        </div>
        <div>
          <h2>{t('landing-page:polls-title')}</h2>
          <p>{t('landing-page:polls-p1')}</p>
        </div>
        <div>
          <h2 className={styles.ctaTitle}>{t('landing-page:cta-title')}</h2>
          <Link href={REGISTER}>
            <a
              className={`button button--fit button--noMinHeight button--ghost ${styles.registerButton}`}
            >
              {t('auth:register')}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
