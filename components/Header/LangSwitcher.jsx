import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdArrowDropDown } from 'react-icons/md';

import styles from './Dropdown.module.scss';

export const LangSwitcher = ({ className }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => setOpen(false);

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ''}`}
      onBlur={(event) => {
        if (!containerRef.current.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        className={`button--noMinHeight button--fit ${styles.toggleButton} ${
          styles['toggleButton--small']
        } ${open ? styles['toggleButton--open'] : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{router.locale?.toUpperCase()}</span>
        <MdArrowDropDown
          className={`dropdownIcon ${open ? 'open' : ''}`}
          viewBox="6 6 12 12"
        />
      </button>
      <ul
        className={`${styles.menu} ${styles['menu--fullWidth']} ${
          open ? styles['menu--open'] : ''
        }`}
      >
        <li className={router.locale === 'nl' ? 'active' : ''}>
          <Link href={router.asPath} locale="nl">
            NL
          </Link>
        </li>
        <li className={router.locale === 'en' ? 'active' : ''}>
          <Link href={router.asPath} locale="en">
            EN
          </Link>
        </li>
      </ul>
    </div>
  );
};
