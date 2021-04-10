import React, { createContext } from 'react';
import { SessionProvider } from './SessionContext';
import { GoogleApiProvider } from './GoogleApiContext';
import { DatabaseProvider } from './DatabaseContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
      <DatabaseProvider>
        <GoogleApiProvider>
          <SessionProvider>{children}</SessionProvider>
        </GoogleApiProvider>
      </DatabaseProvider>
    </GlobalContext.Provider>
  );
};
