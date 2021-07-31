import React from 'react';
import { useTranslation } from 'next-i18next';

import { Chatroom, Chatbox, ParticipantsButton } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './ChatPanel.module.scss';

export const ChatPanel = (props) => {
  const { t } = useTranslation(['artist-dashboard']);

  return (
    <DashboardPanel
      name={t('artist-dashboard:chat')}
      contentClassName={styles.panelContainer}
      {...props}
    >
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
