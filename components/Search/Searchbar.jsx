import React from 'react';
import { FaSearch } from 'react-icons/fa';

import { Input } from '@/components';

import styles from './Searchbar.module.scss';

export const Searchbar = ({ artistDashboard, className, variant }) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Input
        name="search"
        type="text"
        autoComplete="off"
        variant={variant}
        placeholder="Search shows"
        noPadding
        noErrors
        className={`${styles.searchInput}`}
        containerClassName={`${styles.searchInputContainer}`}
      />
      <Input
        name="date"
        placeholder="Date"
        type="date"
        className={`${styles.dateInput}`}
        containerClassName={`${styles.dateInputContainer}`}
        autoComplete="off"
        variant={variant}
        withClearButton
        noPadding
        withIcon
        minDate={!artistDashboard ? 'today' : null}
      />
      <button
        type="submit"
        className={`button--fit button-noMinHeight ${styles.button}`}
      >
        <FaSearch size="1.4rem" />
      </button>
    </div>
  );
};
