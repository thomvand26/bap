import React from 'react';
import Slider from 'rc-slider';

import { InfoHover } from '@/components';

import styles from './input.module.scss';

export const InputSlider = ({
  isRange,
  id,
  label,
  info,
  hasFocused,
  variant,
  defaultValue,
  value,
  ...props
}) => {

  return (
    <div className={styles.sliderContainer}>
      <label
        htmlFor={id}
        className={`${styles.label} ${
          hasFocused ? styles['label--touched'] : ''
        }`}
      >
        <div className={styles.label__left}>
          {label}
          {info && <InfoHover content={info} />}
        </div>
        <div className={styles.label__right}>
          {typeof value === 'number' ? value : defaultValue}
        </div>
      </label>
      <Slider
        className={`rc-slider--${variant}`}
        defaultValue={defaultValue}
        value={value}
        {...props}
      />
    </div>
  );
};
