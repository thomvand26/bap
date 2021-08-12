import React from 'react';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { appConfig } from '@/config';
import { Layouts } from '@/layouts';
import { LANDING } from '@/routes';

import styles from './Custom404.module.scss';
import { useTranslation } from 'next-i18next';

export default function Custom404() {
  const { t } = useTranslation(['not-found-page']);

  return (
    <div className={`${styles.page404}`}>
      <Head>
        <title>{`${appConfig.appName} - ${t(
          'not-found-page:page-title'
        )}`}</title>
      </Head>
      <h1 className={styles.heading}>{t('not-found-page:page-title')}</h1>
      <div className={styles.info}>{t('not-found-page:info')}</div>
      <Link type="button" href={LANDING}>
        <a className="button button--fit">{t('not-found-page:cta')}</a>
      </Link>
    </div>
  );
}

Custom404.layout = Layouts.default;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'not-found-page',
        'auth',
        'navigation',
        'shows',
        'cookies',
        'common',
      ])),
    },
  };
}
