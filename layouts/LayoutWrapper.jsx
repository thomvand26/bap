import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { COOKIES_PRIVACY, LANDING } from '@/routes';
import { useModal, useCookies } from '@/context';
import { CookieForm, LoadingSpinner } from '@/components';
import { DefaultLayout } from './DefaultLayout';
import { NoFooterLayout } from './NoFooterLayout';
import { ShowLayout } from './ShowLayout';

import styles from './LayoutWrapper.module.scss';

export const Layouts = {
  default: DefaultLayout,
  noFooter: NoFooterLayout,
  room: ShowLayout,
};

export const LayoutWrapper = ({ children, ...props }) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { setModalData } = useModal();
  const { cookieValues } = useCookies();
  const { t } = useTranslation(['cookies']);

  const Layout = children.type.layout;
  const isProtected = children.type.isProtected;

  const checkCookies = (url, cookieValues) => {
    if (typeof window === 'undefined') return;

    if (url === COOKIES_PRIVACY || cookieValues) {
      setModalData(null);
      return;
    }

    if (!cookieValues) {
      setModalData({
        heading: t('cookies:cookie-modal-heading'),
        intro: t('cookies:cookie-modal-intro'),
        children: () => <CookieForm withMoreInfoLink />,
        keepOpen: true,
      });
    }
  };

  useEffect(() => {
    checkCookies(router.asPath, cookieValues);
  }, [router?.asPath, cookieValues]);

  useEffect(() => {
    if (!isProtected) return;
    if (loading) return;
    if (typeof window === 'undefined') return;
    if (session?.user?._id) return;
    router.push(LANDING);
  }, [isProtected, loading, typeof window]);

  return typeof window !== 'undefined' &&
    isProtected &&
    (loading || !session?.user?._id) ? (
    <div className={styles.loadingContainerFull}>
      <LoadingSpinner message={router.locale === 'en' ? 'Loading' : 'Laden'} />
    </div>
  ) : Layout ? (
    <Layout {...props}>{children}</Layout>
  ) : (
    <DefaultLayout {...props}>{children}</DefaultLayout>
  );
};
