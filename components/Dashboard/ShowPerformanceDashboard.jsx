import React from 'react';

import { breakpoints } from '@/config';
import { useWindowSize } from '@/utils';
import { Dashboard } from './Dashboard';
import {
  DashboardPanel,
  ChatPanel,
  StreamPreviewPanel,
  SongRequestsPanel,
  PollPanel,
  PerformanceViewManagerPanel,
} from './DashboardPanels';

export const ShowPerformanceDashboard = () => {
  const { width } = useWindowSize();

  return (
    <Dashboard performance>
      <StreamPreviewPanel
        name="Preview"
        toggle
        colspan={2}
        rowspan={2}
        isPerformance
      />
      {width <= breakpoints.m ? (
        <PerformanceViewManagerPanel />
      ) : (
        <>
          <SongRequestsPanel
            name="Song requests"
            toggle
            colspan={1}
            rowspan={3}
          />
          <ChatPanel name="Chat" toggle colspan={1} rowspan={3} />
          <PollPanel name="Polls" toggle colspan={2} rowspan={2} />
          <DashboardPanel area colspan={2} rowspan={1} />
        </>
      )}
    </Dashboard>
  );
};
