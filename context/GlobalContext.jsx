import React, { createContext } from 'react';
import { Provider } from 'next-auth/client';
import { GoogleApiProvider } from './GoogleApiContext';
import { DatabaseProvider } from './DatabaseContext';
import { SocketProvider } from './SocketContext';
import { ShowProvider } from './ShowContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children, pageProps }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
      <Provider session={pageProps.session}>
        <DatabaseProvider>
          <SocketProvider>
            <GoogleApiProvider>
              <ShowProvider>
                {children}
              </ShowProvider>
            </GoogleApiProvider>
          </SocketProvider>
        </DatabaseProvider>
      </Provider>
    </GlobalContext.Provider>
  );
};
