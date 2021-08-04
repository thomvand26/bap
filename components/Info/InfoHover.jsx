import React from 'react';
import { MdInfoOutline } from 'react-icons/md';

import { Tooltip } from '@/components';

import styles from './Infohover.module.scss';

export const InfoHover = ({ content }) => {
  return (
    <Tooltip content={content} className={styles.tooltip}>
      <MdInfoOutline className={styles.info} />
    </Tooltip>
  );
};
