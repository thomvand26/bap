// https://github.com/haoxins/react-flatpickr

import React from 'react';
import Flatpickr from 'react-flatpickr';

import 'flatpickr/dist/themes/material_green.css';

import styles from './input.module.scss';

export const DateInput = ({
  withTime,
  mode = 'single',
  coupledRangeElementSelector,
  ...props
}) => {
  return (
    <Flatpickr
      className={`${styles.input}`}
      value={new Date(props.value)}
      onChange={(date, dateString, instance) => {
        props?.onChange?.(date[0].toISOString());
      }}
      options={{
        enableTime: withTime,
        time_24hr: true,
        mode,
        dateFormat: 'd-m-Y  H:i',
      }}
    />
  );
};
