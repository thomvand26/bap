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
  SharePanel,
} from './DashboardPanels';

export const ShowPerformanceDashboard = () => {
  const { width } = useWindowSize();

  return (
    <Dashboard performance>
      <StreamPreviewPanel toggle colspan={2} rowspan={2} isPerformance />
      {width <= breakpoints.m ? (
        <PerformanceViewManagerPanel />
      ) : (
        <>
          <SongRequestsPanel toggle colspan={1} rowspan={3} />
          <ChatPanel toggle colspan={1} rowspan={3} />
          <PollPanel toggle colspan={2} rowspan={2} />
          <SharePanel area colspan={2} rowspan={1} />
        </>
      )}
    </Dashboard>
  );
};
