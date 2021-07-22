import React from 'react';

import { Tooltip } from '@/components';

import styles from './Infohover.module.scss';

export const InfoHover = ({ content }) => {
  return (
    <Tooltip content={content} className={styles.tooltip}>
      <div className={styles.info}>i</div>
    </Tooltip>
  );
};
