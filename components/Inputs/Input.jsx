import React, { useState } from 'react';
import { Field } from 'formik';

import { InfoHover } from '@/components';
import { DateInput } from './DateInput';
import { InputSlider } from './InputSlider';
import { InputToggle } from './InputToggle';
import { InputSelect } from './InputSelect';

import styles from './Input.module.scss';

// variant: 'default', 'darkest', 'dark' or 'light'
export const Input = ({
  form,
  name,
  label,
  info,
  value,
  variant = 'default',
  noPadding,
  noErrors,
  onChange,
  className,
  containerClassName,
  defaultWidth,
  noPaddingBottom,
  ...props
}) => {
  const id = props?.id || name;
  const [hasFocused, setHasFocused] = useState(false);

  return (
    <div
      className={`${styles.container} ${styles[`container--${props.type}`]} ${
        variant === 'darkest' || 'dark' || 'light'
          ? styles[`container--${variant}`]
          : ''
      } ${noPadding ? styles['container--noPadding'] : ''} ${
        noPaddingBottom ? styles['container--noPaddingBottom'] : ''
      } ${defaultWidth ? styles['container--defaultWidth'] : ''} ${
        containerClassName || ''
      } `}
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
              label={label}
              info={info}
              hasFocused={hasFocused}
              onFocus={() => setHasFocused(true)}
              variant={variant}
              onChange={(value) => {
                form.setFieldValue(field.name, value);
              }}
            />
          ) : props.type === 'select' ? (
            <InputSelect
              {...field}
              {...props}
              id={id}
              label={label}
              info={info}
              hasFocused={hasFocused}
              onFocus={() => setHasFocused(true)}
              variant={variant}
              onChange={(option) => {
                onChange?.(option.value);
                form.setFieldValue(field.name, option?.value);
              }}
            />
          ) : (
            <>
              {label && (
                <label htmlFor={id} className={`${styles.label}`}>
                  <span
                    className={`${
                      info ? styles['label__content--withInfo'] : ''
                    }`}
                  >
                    {label}
                  </span>
                  {info && <InfoHover content={info} />}
                </label>
              )}
              {props.type.includes?.('date') ? (
                <DateInput
                  className={`${styles.input} ${className || ''}`}
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
                  className={`${styles.input} ${className || ''}`}
                  {...field}
                  {...props}
                  id={id}
                  onFocus={() => setHasFocused(true)}
                  onChange={(event) => {
                    if (onChange instanceof Function) onChange(event);
                    form.setFieldValue(field.name, event.target.value);
                  }}
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
