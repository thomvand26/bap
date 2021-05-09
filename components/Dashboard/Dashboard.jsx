import React from 'react';

import styles from './dashboard.module.scss';

export const Dashboard = ({ horizontal, children }) => {
  return (
    <div
      className={horizontal ? styles['container--horizontal'] : styles.container}
    >
      {children}
    </div>
  );
};
