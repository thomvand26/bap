import React, { useEffect, useState } from 'react';
import moment from 'moment';

import styles from './input.module.scss';

export const DateInput = ({ withTime, defaultDate, ...props }) => {
  const [value, setValue] = useState();
  const [dateValue, setDateValue] = useState(
    moment(defaultDate).format('YYYY-MM-DD')
  );
  const [timeValue, setTimeValue] = useState(
    moment(defaultDate).format('HH:mm')
  );

  useEffect(() => {
    const totalValue = `${dateValue} ${timeValue}`;
    setValue(totalValue);
    if (props.onChange instanceof Function) props.onChange(totalValue);
  }, [dateValue, timeValue]);

  return (
    <div className={`${styles.input} ${styles.dateInput}`}>
      {/* TODO: Make custom input with picker to make it compatible with all browsers */}
      <input
        className={styles.dateInput__date}
        type="date"
        name={`${props.name}-date`}
        id={`${props.name}-date`}
        value={dateValue}
        onChange={(event) => {
          setDateValue(event.target.value);
        }}
      />
      {withTime && (
        <input
          className={styles.dateInput__time}
          type="time"
          name={`${props.name}-time`}
          id={`${props.name}-time`}
          value={timeValue}
          onChange={(event) => {
            setTimeValue(event.target.value);
          }}
          step="900"
        />
      )}
    </div>
  );
};
