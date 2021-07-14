import React, { useEffect } from 'react';

import { Dashboard } from './Dashboard';
import { StreamPreviewPanel, GeneralSettingsPannel } from './DashboardPanels/';

export const ShowSettingsDashboard = ({ isNewShow }) => {
  return (
    <Dashboard>
      <StreamPreviewPanel name="Preview" colspan={2} rowspan={4} />
      <GeneralSettingsPannel isNewShow={isNewShow} colspan={2} rowspan={4} />
    </Dashboard>
  );
};
