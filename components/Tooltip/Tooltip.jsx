import React, { useState } from 'react';
import { Arrow, useHover, useLayer } from 'react-laag';

import styles from './Tooltip.module.scss';

export const Tooltip = ({ children, content, className, ...props }) => {
  const [isOver, hoverProps] = useHover();
  const [hasFocus, setHasFocus] = useState();
  const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
    isOpen: isOver || hasFocus,
    auto: true,
    placement: 'top-center',
    possiblePlacements: [
      'bottom-start',
      'bottom-end',
      'bottom-center',
      'top-start',
      'top-center',
      'top-end',
    ],
    triggerOffset: 10,
  });

  return (
    <>
      <div
        tabIndex={0}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onMouseOut={() => setHasFocus(false)}
        className={`${styles.childContainer} ${className || ''}`}
        {...props}
        {...triggerProps}
        {...hoverProps}
      >
        {children}
      </div>
      {(isOver || hasFocus) &&
        renderLayer(
          <div className={styles.tooltip} {...layerProps}>
            {content}
            <Arrow
              {...arrowProps}
              className={styles.tooltip__arrow}
              size={10}
              roundness={1}
            />
          </div>
        )}
    </>
  );
};
