import React from 'react';

import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner = ({ message = 'Loading', horizontal, size }) => {
  return (
    <div
      className={`${styles.container} ${
        horizontal ? styles['container--horizontal'] : ''
      } ${size  ? styles[`container--${size}`] : ''}`}
    >
      <div className={`${styles.shapeshifter}`}></div>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};
