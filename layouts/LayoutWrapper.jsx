import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import { COOKIES_PRIVACY, LANDING } from '@/routes';
import { useModal } from '@/context';
import { CookieForm } from '@/components';
import { DefaultLayout } from './DefaultLayout';
import { NoFooterLayout } from './NoFooterLayout';
import { ShowLayout } from './ShowLayout';

import { LoadingSpinner } from '@/components';

import styles from './LayoutWrapper.module.scss';
import { useTranslation } from 'next-i18next';

export const Layouts = {
  default: DefaultLayout,
  noFooter: NoFooterLayout,
  room: ShowLayout,
};

export const LayoutWrapper = ({ children, ...props }) => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { setModalData } = useModal();
  const { t } = useTranslation(['cookies']);

  const Layout = children.type.layout;
  const isProtected = children.type.isProtected;

  const checkCookies = (url) => {
    if (typeof window === 'undefined') return;

    if (url === COOKIES_PRIVACY) {
      setModalData(null);
      return;
    }

    const storedCookieValues = JSON.parse(
      sessionStorage.getItem('cookieValues')
    );

    if (!storedCookieValues) {
      setModalData({
        heading: t('cookies:cookie-modal-heading'),
        intro: t('cookies:cookie-modal-intro'),
        children: () => <CookieForm withMoreInfoLink />,
        keepOpen: true,
      });
    }
  };

  useEffect(() => {
    checkCookies(router.asPath);
  }, [router?.asPath]);

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
