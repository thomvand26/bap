import React from 'react';
import { Dashboard } from './Dashboard';
import {
  DashboardPanel,
  ChatPanel,
  StreamPreviewPanel,
} from './DashboardPanels';

export const ShowPerformanceDashboard = ({ show, loadingShow }) => {
  return (
    <Dashboard>
      <StreamPreviewPanel name="Preview" toggle colspan={2} rowspan={2} />
      <DashboardPanel name="Song requests" toggle colspan={1} rowspan={3} />
      <ChatPanel name="Chat" toggle colspan={1} rowspan={3} />
      <DashboardPanel name="Polls" toggle colspan={2} rowspan={2} />
      {/* <DashboardPanel area colspan={1} rowspan={1} /> */}
      {/* <DashboardPanel area colspan={1} rowspan={1} /> */}
      <DashboardPanel area colspan={2} rowspan={1} />
    </Dashboard>
  );
};
