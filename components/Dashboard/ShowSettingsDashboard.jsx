import React from 'react';

import { Dashboard } from './Dashboard';
import { StreamPreviewPanel, GeneralSettingsPannel } from './DashboardPanels/';

export const ShowSettingsDashboard = ({ isNewShow }) => {
  return (
    <Dashboard>
      <StreamPreviewPanel colspan={2} rowspan={4} />
      <GeneralSettingsPannel isNewShow={isNewShow} colspan={2} rowspan={4} />
    </Dashboard>
  );
};
