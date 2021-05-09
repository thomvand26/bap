import React from 'react';
import { Dashboard } from './Dashboard';
import { StreamPreviewPanel, GeneralSettingsPannel } from './DashboardPanels/';

export const ShowSettingsDashboard = ({ show, loadingShow }) => {
  return (
    <Dashboard>
      <StreamPreviewPanel name="Preview" colspan={2} />
      <GeneralSettingsPannel defaultShow={show} loadingShow={loadingShow} />
    </Dashboard>
  );
};
