import React from 'react';

import { Dashboard } from './Dashboard';
import {
  DashboardPanel,
  ChatPanel,
  StreamPreviewPanel,
  SongRequestsPanel,
  PollPanel,
} from './DashboardPanels';

export const ShowPerformanceDashboard = () => {
  return (
    <Dashboard>
      <StreamPreviewPanel name="Preview" toggle colspan={2} rowspan={2} />
      <SongRequestsPanel name="Song requests" toggle colspan={1} rowspan={3} />
      <ChatPanel name="Chat" toggle colspan={1} rowspan={3} />
      <PollPanel name="Polls" toggle colspan={2} rowspan={2} />
      <DashboardPanel area colspan={2} rowspan={1} />
    </Dashboard>
  );
};
