import React, { createContext } from 'react';
import { SessionProvider } from './SessionContext';
import { GoogleApiProvider } from './GoogleApiContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
        <GoogleApiProvider>
          <SessionProvider>{children}</SessionProvider>
        </GoogleApiProvider>
    </GlobalContext.Provider>
  );
};
