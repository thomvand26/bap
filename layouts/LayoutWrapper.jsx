import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import { LANDING } from '@/routes';
import { DefaultLayout } from './DefaultLayout';
import { NoFooterLayout } from './NoFooterLayout';
import { ShowLayout } from './ShowLayout';

import { LoadingSpinner } from '@/components';

import styles from './LayoutWrapper.module.scss';

export const Layouts = {
  default: DefaultLayout,
  noFooter: NoFooterLayout,
  room: ShowLayout,
};

export const LayoutWrapper = ({ children, ...props }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  const Layout = children.type.layout;
  const isProtected = children.type.isProtected;

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
