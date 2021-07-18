import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import { MdArrowDropDown } from 'react-icons/md';

import { ARTIST_DASHBOARD } from '@/routes';

import styles from './userDropdown.module.scss';

export const UserDropdown = () => {
  const [session] = useSession();
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onBlur={(event) => {
        if (!containerRef.current.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        className={`button--ghost button--noMinHeight button--fit ${
          styles.toggleButton
        } ${open ? styles['toggleButton--open'] : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{session?.user?.username}</span>
        <MdArrowDropDown
          className={`dropdownIcon ${open ? 'open' : ''}`}
          viewBox="6 6 12 12"
        />
      </button>
      <ul className={`${styles.menu} ${open ? styles['menu--open'] : ''}`}>
        <li>
          <Link href={ARTIST_DASHBOARD}>Artist dashboard</Link>
        </li>
        <li>
          <button className={`button--unstyled`}>Settings</button>
        </li>
        <li>
          <button className={`button--unstyled`}>Logout</button>
        </li>
      </ul>
    </div>
  );
};
