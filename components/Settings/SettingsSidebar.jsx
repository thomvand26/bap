import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { SETTINGS, SETTINGS_ACCOUNT, SETTINGS_REMINDERS } from '@/routes';

import styles from './SettingsSidebar.module.scss';

export const SettingsSidebar = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <ul>
        <li
          className={
            router.pathname === SETTINGS || router.pathname === SETTINGS_ACCOUNT
              ? 'active'
              : ''
          }
        >
          <Link href={SETTINGS_ACCOUNT}>Account</Link>
        </li>
        <li className={router.pathname === SETTINGS_REMINDERS ? 'active' : ''}>
          <Link href={SETTINGS_REMINDERS}>Reminders</Link>
        </li>
      </ul>
    </div>
  );
};
