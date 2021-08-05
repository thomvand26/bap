import React, { createContext } from 'react';

import { DatabaseProvider } from './DatabaseContext';
import { SocketProvider } from './SocketContext';
import { ShowProvider } from './ShowContext';
import { ModalProvider } from './ModalContext';
import { CookieProvider } from './CookieContext';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children, pageProps }) => {
  const exports = {};

  return (
    <GlobalContext.Provider value={exports}>
        <CookieProvider>
          <DatabaseProvider>
            <SocketProvider>
              <ShowProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </ShowProvider>
            </SocketProvider>
          </DatabaseProvider>
        </CookieProvider>
    </GlobalContext.Provider>
  );
};
