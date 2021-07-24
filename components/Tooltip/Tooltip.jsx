import React from 'react';
import { Arrow, useHover, useLayer } from 'react-laag';

import styles from './Tooltip.module.scss';

export const Tooltip = ({ children, content, ...props }) => {
  const [isOver, hoverProps] = useHover();
  const { triggerProps, layerProps, arrowProps, renderLayer } = useLayer({
    isOpen: isOver,
    auto: true,
    placement: 'top-center',
    possiblePlacements: [
      "bottom-start",
      "bottom-end",
      "bottom-center",
      "top-start",
      "top-center",
      "top-end"
    ],
    triggerOffset: 10,
  });

  return (
    <>
      <div
        {...props}
        {...triggerProps}
        {...hoverProps}
      >
        {children}
      </div>
      {isOver &&
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
