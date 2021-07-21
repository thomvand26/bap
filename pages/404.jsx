import React from 'react';
import Link from 'next/link';

import { Layouts } from '@/layouts';
import { LANDING } from '@/routes';

import styles from './index.module.scss';

export default function Custom404() {
  return (
    <div className={`${styles.page404}`}>
      <h1 className={styles.heading}>404 - Pagina niet gevonden</h1>
      <div className={styles.info}>
        De pagina die je zoekt is gewijzigd of bestaat niet meer.
      </div>
      <Link type="button" href={LANDING}>
        <a className="button button--fit">Ga terug naar de startpagina</a>
      </Link>
    </div>
  );
}

Custom404.layout = Layouts.default;
