import { useShow } from '@/context/ShowContext';
import React, { useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { StreamPreviewPanel, GeneralSettingsPannel } from './DashboardPanels/';

export const ShowSettingsDashboard = ({ show, loadingShow }) => {

  return (
    <Dashboard>
      <StreamPreviewPanel name="Preview" colspan={2} rowspan={4} />
      <GeneralSettingsPannel
        defaultShow={show}
        loadingShow={loadingShow}
        colspan={2}
        rowspan={4}
      />
    </Dashboard>
  );
};
