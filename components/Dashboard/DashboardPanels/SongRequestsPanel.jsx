import React from 'react';

import { SongRequestList, Chatbox } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './SongRequestsPanel.module.scss';

export const SongRequestsPanel = (props) => {
  return (
    <DashboardPanel contentClassName={styles.panelContainer} {...props}>
      <SongRequestList inDashboard={true} />
      <div className={styles.chatboxContainer}>
        <Chatbox inDashboard forSongRequest />
      </div>
    </DashboardPanel>
  );
};
