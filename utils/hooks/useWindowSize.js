import React, { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const [hasWindow, setHasWindow] = useState(typeof window !== undefined);
  const [windowSize, setWindowSize] = useState({});

  useEffect(() => {
    setHasWindow(typeof window !== undefined);
  }, [typeof window]);

  useEffect(() => {
    if (!hasWindow) return;

    const updateWindowSize = () => {
      setWindowSize({ width: window?.innerWidth, height: window?.innerHeight });
    };

    updateWindowSize();

    window?.addEventListener('resize', updateWindowSize);

    return () => {
      if (hasWindow) {
        window?.removeEventListener('resize', updateWindowSize);
      }
    };
  }, [hasWindow]);

  return windowSize;
};
