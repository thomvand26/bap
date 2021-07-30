import React, { createContext } from 'react';
import { Provider as NextAuthProvider } from 'next-auth/client';

import { GoogleApiProvider } from './GoogleApiContext';
import { DatabaseProvider } from './DatabaseContext';
import { SocketProvider } from './SocketContext';
import { ShowProvider } from './ShowContext';
import { ModalProvider } from './ModalContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children, pageProps }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
      <NextAuthProvider session={pageProps.session}>
        <DatabaseProvider>
          <SocketProvider>
            <GoogleApiProvider>
              <ShowProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </ShowProvider>
            </GoogleApiProvider>
          </SocketProvider>
        </DatabaseProvider>
      </NextAuthProvider>
    </GlobalContext.Provider>
  );
};
