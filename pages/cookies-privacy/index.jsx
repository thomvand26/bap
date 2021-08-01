import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Layouts } from '@/layouts';
import { CookieForm } from '@/components';

import styles from './CookiesPrivacyPage.module.scss';

export default function CookiesPrivacyPage() {
  const { t } = useTranslation(['cookies-privacy-page']);

  return (
    <div className={`page container ${styles.page}`}>
      <div className="container__content container__content--fullText">
        <h1 className="page__title">{t('cookies-privacy-page:page-title')}</h1>
        <p>{t('cookies-privacy-page:intro')}</p>
        <h2>{t('cookies-privacy-page:strictly-necessary-title')}</h2>
        <p>{t('cookies-privacy-page:strictly-necessary-p1')}</p>
        <h2>{t('cookies-privacy-page:account-title')}</h2>
        <p>{t('cookies-privacy-page:account-p1')}</p>
        <ul>
          <li>{t('cookies-privacy-page:account-li1')}</li>
          <li>{t('cookies-privacy-page:account-li2')}</li>
          <li>{t('cookies-privacy-page:account-li3')}</li>
        </ul>
        <p>{t('cookies-privacy-page:account-p2')}</p>
        <p>{t('cookies-privacy-page:account-p3')}</p>
        <h2>{t('cookies-privacy-page:chat-and-more-title')}</h2>
        <p>{t('cookies-privacy-page:chat-and-more-p1')}</p>
        <p>{t('cookies-privacy-page:chat-and-more-p2')}</p>
        <p>{t('cookies-privacy-page:chat-and-more-p3')}</p>
        <p>{t('cookies-privacy-page:chat-and-more-p4')}</p>
        <p>{t('cookies-privacy-page:chat-and-more-p5')}</p>
        <p>{t('cookies-privacy-page:chat-and-more-p6')}</p>
        <h2>{t('cookies-privacy-page:shows-title')}</h2>
        <p>{t('cookies-privacy-page:shows-p1')}</p>
        <h2>{t('cookies-privacy-page:youtube-title')}</h2>
        <p>{t('cookies-privacy-page:youtube-p1')}</p>
        <CookieForm className={styles.cookieForm} />
      </div>
    </div>
  );
}

CookiesPrivacyPage.layout = Layouts.default;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'cookies-privacy-page',
        'cookies',
        'auth',
        'navigation',
        'shows',
      ])),
    },
  };
}
