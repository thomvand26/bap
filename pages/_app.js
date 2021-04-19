import '../styles/globals.scss';
import { GlobalProvider } from '../context';
import { LayoutWrapper } from '../layouts';

export default function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider pageProps={pageProps} >
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </GlobalProvider>
  );
}
