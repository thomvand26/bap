import { appWithTranslation } from 'next-i18next';

import { GlobalProvider } from '../context';
import { LayoutWrapper } from '../layouts';

import '../styles/app.scss';

const MyFullApp = appWithTranslation(({ Component, pageProps }) => (
  <LayoutWrapper>
    <Component {...pageProps} />
  </LayoutWrapper>
));

const MyApp = ({ Component, pageProps }) => {
  return (
    <GlobalProvider pageProps={pageProps}>
      <MyFullApp Component={Component} pageProps={pageProps} />
    </GlobalProvider>
  );
};

export default MyApp;
