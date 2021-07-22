import React from 'react';

import { Chatroom, Chatbox, ParticipantsButton } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './ChatPanel.module.scss';

export const ChatPanel = (props) => {
  return (
    <DashboardPanel contentClassName={styles.panelContainer} {...props}>
      <ParticipantsButton inDashboard />
      <div className={styles.contentContainer}>
        <Chatroom inDashboard />
        <div className={styles.chatboxContainer}>
          <Chatbox inDashboard />
        </div>
      </div>
    </DashboardPanel>
  );
};
