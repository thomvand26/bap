import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Layouts } from '@/layouts';

import styles from './AboutPage.module.scss';

export default function AboutPage() {
  const { t } = useTranslation(['about-page']);

  return (
    <div className={`page container ${styles.page}`}>
      <div className="container__content container__content--fullText">
        <h1 className="page__title">{t('about-page:page-title')}</h1>
        <p>{t('about-page:p1')}</p>
        <p>
          {t('about-page:email')}
          {': '}
          <a href={`mailto:${t('about-page:contact-email')}`}>
            {t('about-page:contact-email')}
          </a>
        </p>
      </div>
    </div>
  );
}

AboutPage.layout = Layouts.default;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'about-page',
        'auth',
        'navigation',
        'shows',
      ])),
    },
  };
}
