import React, { useState } from 'react';

import { DashboardPanel } from './DashboardPanel';
import { ChatPanel } from './ChatPanel';
import { SongRequestsPanel } from './SongRequestsPanel';
import { PollPanel } from './PollPanel';

import styles from './PerformanceViewManagerPanel.module.scss';

export const PerformanceViewManagerPanel = ({ isPerformance, ...props }) => {
  const [panelContentId, setPanelContentId] = useState('chat');

  return (
    <DashboardPanel contentClassName={styles.dashboardPanelContent} {...props}>
      <ul className={`${styles.navigation}`}>
        <li className={panelContentId === 'chat' ? 'active' : ''}>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId('chat')}
          >
            Chat
          </button>
        </li>
        <li className={panelContentId === 'song-request' ? 'active' : ''}>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId('song-request')}
          >
            Song requests
          </button>
        </li>
        <li className={panelContentId === 'polls' ? 'active' : ''}>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId('polls')}
          >
            Polls
          </button>
        </li>
        <li>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId()}
          >
            Actions
          </button>
        </li>
      </ul>
      <div className={styles.content}>
        {panelContentId === 'chat' && <ChatPanel />}
        {panelContentId === 'song-request' && <SongRequestsPanel />}
        {panelContentId === 'polls' && <PollPanel />}
      </div>
    </DashboardPanel>
  );
};
