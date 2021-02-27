import '../styles/globals.scss';
import { useEffect } from 'react';
import { GlobalProvider } from '../context';
import { SessionProvider } from '../context/SessionContext';

export default function MyApp({ Component, pageProps }) {

  return (
    <GlobalProvider>
      <Component {...pageProps} />
    </GlobalProvider>
  );
}
