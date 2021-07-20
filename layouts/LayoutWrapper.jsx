import { DefaultLayout } from './DefaultLayout';
import { SettingsLayout } from './SettingsLayout';
import { ShowLayout } from './ShowLayout';

export const Layouts = {
  default: DefaultLayout,
  room: ShowLayout,
  settings: SettingsLayout,
};

export const LayoutWrapper = ({ children, ...props }) => {
  const Layout = children.type.layout;

  return Layout ? (
    <Layout {...props}>{children}</Layout>
  ) : (
    <DefaultLayout {...props}>{children}</DefaultLayout>
  );
};
