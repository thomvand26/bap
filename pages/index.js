import { ShowList } from '../components';
import { Layouts } from '../layouts';
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
    <div className={styles.page}>
      <h2 className="pageHeader">Shows</h2>
      <ShowList showCreateShowBtn />
    </div>
  );
}

HomePage.layout = Layouts.default;
