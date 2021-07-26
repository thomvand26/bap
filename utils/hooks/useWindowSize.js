import React, { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: (process.browser && window?.innerWidth) || 1600,
    height: (process.browser && window?.innerHeight) || 900,
  });

  useEffect(() => {
    if (!process.browser || !window) return;

    const updateWindowSize = () => {
      setWindowSize({ width: window?.innerWidth, height: window?.innerHeight });
    };

    window?.addEventListener('resize', updateWindowSize);

    return () => {
      if (process.browser && window) {
        window?.removeEventListener('resize', updateWindowSize);
      }
    };
  }, []);

  return windowSize;
};
