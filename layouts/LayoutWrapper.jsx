import { DefaultLayout } from './DefaultLayout';
import { NoFooterLayout } from './NoFooterLayout';
import { ShowLayout } from './ShowLayout';

export const Layouts = {
  default: DefaultLayout,
  noFooter: NoFooterLayout,
  room: ShowLayout,
};

export const LayoutWrapper = ({ children, ...props }) => {
  const Layout = children.type.layout;

  return Layout ? (
    <Layout {...props}>{children}</Layout>
  ) : (
    <DefaultLayout {...props}>{children}</DefaultLayout>
  );
};
