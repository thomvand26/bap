import { useSession } from 'next-auth/client';
import React, { useEffect } from 'react';

import { LANDING } from '@/routes';
import { useRouter } from 'next/router';

export const ProtectedRoute = ({ redirectRoute = LANDING }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!session?.user) {
      router.push(redirectRoute);
    }
  }, [loading]);
  return <></>;
};
