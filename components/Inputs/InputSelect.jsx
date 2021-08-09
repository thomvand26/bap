import React, { useEffect, useRef, useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

import { InfoHover } from '@/components';

import styles from './Input.module.scss';

export const InputSelect = ({
  id,
  label,
  info,
  hasFocused,
  variant,
  submitOnChange,
  options,
  noPaddingBottom,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    options.find((option) => option.value === props.defaultValue) || options[0]
  );
  const containerRef = useRef();

  useEffect(() => {
    props?.onChange?.(selected);
  }, [selected]);

  useEffect(() => {
    setSelected(
      options.find((option) => option.value === props.value) ||
        options.find((option) => option.value === props.defaultValue) ||
        options[0]
    );
  }, [props.defaultValue, props.value]);

  const select = (option) => {
    setOpen(false);
    setSelected(option);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.selectContainer} ${styles['container--defaultWidth']}`}
      onBlur={(event) => {
        if (!containerRef.current.contains(event.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <label
        htmlFor={id}
        className={`${styles.label} ${
          hasFocused ? styles['label--touched'] : ''
        }`}
      >
        <div className={styles.label__left}>
          <span className={`${info ? styles['label__content--withInfo'] : ''}`}>
            {label}
          </span>
          {info && <InfoHover content={info} />}
        </div>
      </label>
      <button
        type="button"
        className={`button--unstyled ${styles.input} ${
          open ? styles['input--open'] : ''
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label}</span>
        <MdArrowDropDown
          className={`dropdownIcon ${open ? 'open' : ''} ${
            styles.dropdownIcon
          }`}
          viewBox="6 6 12 12"
        />
      </button>
      <ul
        className={`${styles.menu} ${open ? styles['menu--open'] : ''} ${
          noPaddingBottom ? styles['menu--noPaddingBottom'] : ''
        }`}
      >
        {options.map((option, i) => (
          <li key={i}>
            <button
              type={`${submitOnChange ? 'submit' : 'button'}`}
              className={`button--unstyled`}
              onClick={() => select(option)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
