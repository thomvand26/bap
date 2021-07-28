import React from 'react';

import styles from './Dashboard.module.scss';

export const Dashboard = ({ horizontal, performance, children }) => {
  return (
    <div
      className={`${styles.container} ${
        horizontal ? styles['container--horizontal'] : ''
      } ${
        performance ? styles['container--performance'] : ''
      }`}
    >
      {children}
    </div>
  );
};
