import { ShowList } from '../components';
import { Layouts } from '../layouts';
import styles from './index.module.scss';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <h2 className="pageHeader">Shows</h2>
      <ShowList showCreateShowBtn />
    </div>
  );
}

HomePage.layout = Layouts.default;
