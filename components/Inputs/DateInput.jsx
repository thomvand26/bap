// https://github.com/haoxins/react-flatpickr

import React from 'react';
import Flatpickr from 'react-flatpickr';
import { FaRegCalendarAlt, FaTimes } from 'react-icons/fa';

import 'flatpickr/dist/themes/material_green.css';

import styles from './Input.module.scss';

export const DateInput = ({
  withTime,
  mode = 'single',
  coupledRangeElementSelector,
  placeholder,
  withClearButton,
  withIcon,
  className,
  minDate,
  maxDate,
  ...props
}) => {
  return (
    <div className={`${styles.dateContainer}`}>
      <Flatpickr
        // --withCalendarIcon
        className={`${styles.input} ${
          withClearButton ? styles['input--withClearButton'] : ''
        } ${withIcon ? styles['input--withCalendarIcon'] : ''} ${
          className || ''
        }`}
        value={props.value ? new Date(props.value) : props.value}
        onChange={(date, dateString, instance) => {
          props?.onChange?.(date?.[0]?.toISOString?.());
        }}
        options={{
          enableTime: withTime,
          time_24hr: true,
          mode,
          dateFormat: withTime ? 'd-m-Y  H:i' : 'd-m-Y',
          minDate,
          maxDate,
        }}
        placeholder={placeholder}
      />
      {withIcon && <FaRegCalendarAlt className={`${styles.calendarIcon}`} />}
      {withClearButton && props.value && (
        <button
          type="button"
          className={`button--icon ${styles.closeButton}`}
          onClick={() => props?.onChange?.(null)}
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};
