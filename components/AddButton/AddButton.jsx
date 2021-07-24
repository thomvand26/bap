import React from 'react';
import { FaPlus } from 'react-icons/fa';

import styles from './AddButton.module.scss';

export const AddButton = (props) => {
  return (
    <button
      type="button"
      className={`button--fit button--icon button--ghost ${styles.button}`}
      {...props}
    >
      <FaPlus className={styles.icon} />
    </button>
  );
};
