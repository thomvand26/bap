import React from 'react';
import { useTranslation } from 'next-i18next';

import { SongRequestList, Chatbox } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './SongRequestsPanel.module.scss';

export const SongRequestsPanel = (props) => {
  const { t } = useTranslation(['artist-dashboard']);

  return (
    <DashboardPanel
      name={t('artist-dashboard:song-requests')}
      contentClassName={styles.panelContainer}
      {...props}
    >
      <SongRequestList inDashboard={true} />
      <div className={styles.chatboxContainer}>
        <Chatbox inDashboard forSongRequest />
      </div>
    </DashboardPanel>
  );
};
