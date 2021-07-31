import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

import { DashboardPanel } from './DashboardPanel';
import { ChatPanel } from './ChatPanel';
import { SongRequestsPanel } from './SongRequestsPanel';
import { PollPanel } from './PollPanel';

import styles from './PerformanceViewManagerPanel.module.scss';

export const PerformanceViewManagerPanel = ({ isPerformance, ...props }) => {
  const { t } = useTranslation('artist-dashboard');
  const [panelContentId, setPanelContentId] = useState('chat');

  return (
    <DashboardPanel contentClassName={styles.dashboardPanelContent} {...props}>
      <ul className={`${styles.navigation}`}>
        <li className={panelContentId === 'chat' ? 'active' : ''}>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId('chat')}
          >
            {t('artist-dashboard:chat')}
          </button>
        </li>
        <li className={panelContentId === 'song-request' ? 'active' : ''}>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId('song-request')}
          >
            {t('artist-dashboard:song-requests')}
          </button>
        </li>
        <li className={panelContentId === 'polls' ? 'active' : ''}>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId('polls')}
          >
            {t('artist-dashboard:polls')}
          </button>
        </li>
        <li>
          <button
            className={`button--unstyled`}
            onClick={() => setPanelContentId()}
          >
            {t('artist-dashboard:actions')}
          </button>
        </li>
      </ul>
      <div className={styles.content}>
        {panelContentId === 'chat' && <ChatPanel name={null} />}
        {panelContentId === 'song-request' && <SongRequestsPanel name={null} />}
        {panelContentId === 'polls' && <PollPanel name={null} />}
      </div>
    </DashboardPanel>
  );
};
