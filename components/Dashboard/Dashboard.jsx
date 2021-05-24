import React from 'react';

import styles from './dashboard.module.scss';

export const Dashboard = ({ horizontal, children }) => {
  return (
    <div
      className={`${styles.container} ${horizontal ? styles['container--horizontal'] : ''}`}
    >
      {children}
    </div>
  );
};
