import React, { createContext } from 'react';
import { SessionProvider } from './SessionContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </GlobalContext.Provider>
  );
};
