import React, { useState } from 'react';
import { Field, getIn } from 'formik';

import styles from './input.module.scss';

// Theme: 'dark' or 'light'
export const Input = ({ form, name, label, theme = 'light', ...props }) => {
  // export const Input = ({ id, label, field, form, ...props }) => {
  // console.log('form:', form, name, props);
  const id = props?.id || name;
  const [hasFocused, setHasFocused] = useState(false);

  return (
    <div
      className={`${styles.container} ${
        theme === 'dark' ? styles['container--dark'] : ''
      }`}
    >
      <Field name={name} {...props}>
        {({ form, field }) => {
          return (
            <>
              <label
                htmlFor={id}
                className={`${styles.label} ${
                  hasFocused ? styles['label--touched'] : ''
                }`}
              >
                {label}
              </label>
              <input
                className={`${styles.input} ${props?.className || ''}`}
                {...field}
                {...props}
                id={id}
                onFocus={() => setHasFocused(true)}
              ></input>
              {form?.touched?.[name] && form?.errors?.[name] ? (
                <div className={styles.error}>{form?.errors?.[name]}</div>
              ) : null}
            </>
          );
        }}
      </Field>
    </div>
  );
};
