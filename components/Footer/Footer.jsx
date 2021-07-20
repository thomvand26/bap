import { ABOUT, LANDING, SEARCH } from '@/routes';
import Link from 'next/link';
import React from 'react';
import { Logo } from '../Logo/Logo';

import styles from './Footer.module.scss';

export const Footer = () => {
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
          <li>
            <Link href={SEARCH}>Shows</Link>
          </li>
          <li>
            <Link href={ABOUT}>About</Link>
          </li>
          <li>
            <Link href={LANDING}>Cookies & Privacy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};
