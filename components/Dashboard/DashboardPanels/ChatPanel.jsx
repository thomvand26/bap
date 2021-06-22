import React from 'react';

import { DashboardPanel } from './DashboardPanel';
import { ParticipantsButton } from '@/components/Participants/ParticipantsButton';

export const ChatPanel = (props) => {
  return (
    <DashboardPanel {...props}>
      <ParticipantsButton inDashboard />
    </DashboardPanel>
  );
};
