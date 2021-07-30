import { appWithTranslation } from 'next-i18next';

import { GlobalProvider } from '../context';
import { LayoutWrapper } from '../layouts';

import '../styles/app.scss';

const MyApp = ({ Component, pageProps }) => {
  return (
    <GlobalProvider pageProps={pageProps}>
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </GlobalProvider>
  );
};

export default appWithTranslation(MyApp);
