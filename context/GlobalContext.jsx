import React, { createContext } from 'react';
import { SessionProvider } from './SessionContext';
import { GoogleApiProvider } from './GoogleApiContext';
import { Provider } from 'next-auth/client';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children, pageProps }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
      <Provider session={pageProps.session}>
        <GoogleApiProvider>
          <SessionProvider>{children}</SessionProvider>
        </GoogleApiProvider>
      </Provider>
    </GlobalContext.Provider>
  );
};
