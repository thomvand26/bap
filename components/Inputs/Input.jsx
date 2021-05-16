import React, { useState } from 'react';
import { Field } from 'formik';

import { InfoHover } from '../Info/InfoHover';

import styles from './input.module.scss';
import { DateInput } from './DateInput';
import { InputSlider } from './InputSlider';
import { InputToggle } from './InputToggle';

// variant: 'default', 'dark' or 'light'
export const Input = ({
  form,
  name,
  label,
  info,
  value,
  variant = 'default',
  noPadding,
  noErrors,
  ...props
}) => {
  const id = props?.id || name;
  const [hasFocused, setHasFocused] = useState(false);

  return (
    <div
      className={`${styles.container} ${styles[`container--${props.type}`]} ${
        variant === 'dark' || 'light' ? styles[`container--${variant}`] : ''
      } ${noPadding ? styles['container--noPadding'] :''}`}
    >
      <Field name={name} {...props}>
        {({ form, field }) => {
          return props.type === 'slider' || props.type === 'range' ? (
            <InputSlider
              {...field}
              {...props}
              id={id}
              isRange={props.type === 'range'}
              label={label}
              info={info}
              hasFocused={hasFocused}
              onFocus={() => setHasFocused(true)}
              variant={variant}
              onChange={(value) => {
                form.setFieldValue(field.name, value);
              }}
            />
          ) : props.type === 'toggle' ? (
            <InputToggle
              {...field}
              {...props}
              id={id}
              isRange={props.type === 'range'}
              label={label}
              info={info}
              hasFocused={hasFocused}
              onFocus={() => setHasFocused(true)}
              variant={variant}
              onChange={(value) => {
                form.setFieldValue(field.name, value);
              }}
            />
          ) : (
            <>
              <label
                htmlFor={id}
                className={`${styles.label} ${
                  hasFocused ? styles['label--touched'] : ''
                }`}
              >
                {label}
                {info && <InfoHover content={info} />}
              </label>
              {props.type.includes?.('date') ? (
                <DateInput
                  className={`${styles.input} ${props?.className || ''}`}
                  {...field}
                  {...props}
                  id={id}
                  withTime={props.type === 'datetime'}
                  onFocus={() => setHasFocused(true)}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date);
                  }}
                />
              ) : (
                <input
                  className={`${styles.input} ${props?.className || ''}`}
                  {...field}
                  {...props}
                  id={id}
                  onFocus={() => setHasFocused(true)}
                />
              )}
              {form?.touched?.[name] && form?.errors?.[name] && !noErrors ? (
                <div className={styles.error}>{form?.errors?.[name]}</div>
              ) : null}
            </>
          );
        }}
      </Field>
    </div>
  );
};
