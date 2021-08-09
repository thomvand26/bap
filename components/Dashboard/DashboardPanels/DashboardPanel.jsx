import React from 'react';

import styles from './DashboardPanel.module.scss';

export const DashboardPanel = ({
  name,
  toggle,
  row = 1,
  colspan = 1,
  rowspan = 1,
  children,
  className,
  contentClassName,
  withForm,
}) => {
  return (
    <div
      className={`${styles.panel} ${styles[`row--${row}`]} ${className || ''}`}
      style={{ gridColumn: `span ${colspan}`, gridRow: `span ${rowspan}` }}
    >
      {name && (
        <div
          className={`${styles.panel__name} ${
            toggle ? styles['panel__name--toggle'] : ''
          }`}
        >
          {name}
        </div>
      )}
      <div
        className={`${styles.panel__content} ${
          withForm ? styles[`panel__content--withForm`] : ''
        } ${contentClassName || ''}`}
      >
        {children}
      </div>
    </div>
  );
};
