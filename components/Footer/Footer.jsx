import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { ABOUT, LANDING, SEARCH } from '@/routes';
import { Logo } from '../Logo/Logo';

import styles from './Footer.module.scss';

export const Footer = () => {
  const router = useRouter();

  return (
    <footer className={`container ${styles.container}`}>
      <div className={`container__content ${styles.content}`}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.info}>
            RoomStage is een platform gemaakt als bachelorproef binnen de
            afstudeerrichting Grafische en digitale media - Multimediaproductie
            - New Media Development aan de Arteveldehogeschool.
          </div>
        </div>
        <ul className={styles.right}>
          <li className={router.pathname === SEARCH ? 'active' : ''}>
            <Link href={SEARCH}>Shows</Link>
          </li>
          <li className={router.pathname === ABOUT ? 'active' : ''}>
            <Link href={ABOUT}>About</Link>
          </li>
          <li className={router.pathname === LANDING ? 'active' : ''}>
            <Link href={LANDING}>Cookies & Privacy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
