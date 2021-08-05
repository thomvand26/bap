import { appWithTranslation } from 'next-i18next';
import { Provider as NextAuthProvider } from 'next-auth/client';

import { GlobalProvider } from '../context';
import { LayoutWrapper } from '../layouts';

import '../styles/app.scss';

const MyFullApp = appWithTranslation(({ Component, pageProps }) => (
  <GlobalProvider pageProps={pageProps}>
    <LayoutWrapper>
      <Component {...pageProps} />
    </LayoutWrapper>
  </GlobalProvider>
));

const MyApp = ({ Component, pageProps }) => {
  return (
    <NextAuthProvider session={pageProps.session}>
      <MyFullApp Component={Component} pageProps={pageProps} />
    </NextAuthProvider>
  );
};

export default MyApp;
