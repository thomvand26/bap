import React, { useEffect, useState } from 'react';

import { InfoHover } from '@/components';

import styles from './Input.module.scss';

export const InputToggle = ({
  hasFocused,
  id,
  label,
  info,
  variant,
  disabled,
  ...props
}) => {
  const [checked, setChecked] = useState(
    typeof props.value === 'boolean'
      ? props.value
      : typeof props.defaultValue === 'boolean'
      ? props.defaultValue
      : true
  );

  useEffect(() => {
    setChecked(
      typeof props.value === 'boolean'
        ? props.value
        : typeof props.defaultValue === 'boolean'
        ? props.defaultValue
        : true
    );
  }, [props.defaultValue, props.value]);

  const handleChange = (event) => {
    if (props.onChange instanceof Function)
      props.onChange(event.target.checked);
    setChecked(event.target.checked);
  };

  return (
    <div
      className={`${styles.toggleContainer} ${
        styles[`toggleContainer--${variant}`]
      } ${disabled ? styles[`toggleContainer--disabled`] : ''}`}
    >
      <label
        htmlFor={id}
        className={`${styles.label} ${styles['label--noMarginBottom']} ${
          hasFocused ? styles['label--touched'] : ''
        }`}
      >
        <div className={styles.label__left}>
          <span className={`${info ? styles['label__content--withInfo'] : ''}`}>
            {label}
          </span>
          {info && <InfoHover content={info} />}
        </div>
        <div className={styles.label__right}>
          <input
            className={styles.hiddenCheckbox}
            type="checkbox"
            name={props.name}
            id={id}
            onChange={handleChange}
            checked={!!checked}
          />
          <div
            className={`${styles.checkbox} ${
              checked ? styles['checkbox--checked'] : ''
            }`}
          >
            <div className={styles.checkbox__handle}></div>
          </div>
        </div>
      </label>
    </div>
  );
};
