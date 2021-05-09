import { ShowList } from '../components';
import { Layouts } from '../layouts';
// import styles from './index.module.scss';
import { useSession } from 'next-auth/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LOGIN } from '@/routes';

export default function HomePage() {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return;
    if (!session) router.push(LOGIN);
  }, [session]);

  return (
    <div className="page">
      <h2 className="pageHeader">Shows</h2>
    </div>
  );
}

HomePage.layout = Layouts.default;
