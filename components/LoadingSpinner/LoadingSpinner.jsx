import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner = ({ message, horizontal, size }) => {
  const { t } = useTranslation(['common']);

  const [loadingMessage, setLoadingMessage] = useState(
    message === null ? null : message || t('common:loading')
  );

  return (
    <div
      className={`${styles.container} ${
        horizontal ? styles['container--horizontal'] : ''
      } ${size ? styles[`container--${size}`] : ''}`}
    >
      <div className={`${styles.shapeshifter}`}></div>
      {loadingMessage && <div className={styles.message}>{loadingMessage}</div>}
    </div>
  );
};
