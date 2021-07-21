import { DefaultLayout } from './DefaultLayout';
import { ShowLayout } from './ShowLayout';

export const Layouts = {
  default: DefaultLayout,
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
