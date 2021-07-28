import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import { useShow } from '@/context';
import { PollWindow } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './StreamPreviewPanel.module.scss';

export const StreamPreviewPanel = ({ isPerformance, ...props }) => {
  const { currentShow } = useShow();
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);

  useEffect(() => {
    setUrlValid(currentShow?.streamURL);
  }, [currentShow?.streamURL]);

  return (
    <DashboardPanel {...props}>
      <div
        className={`${styles.previewContainer} ${
          isPerformance ? styles['previewContainer--performance'] : ''
        }`}
      >
        {urlValid ? (
          <ReactPlayer
            url={currentShow?.streamURL}
            width="100%"
            height="100%"
            onError={() => {
              setUrlValid(false);
            }}
          />
        ) : (
          <div className="centeredPlaceholder">Invalid Stream URL</div>
        )}
        <PollWindow />
      </div>
    </DashboardPanel>
  );
};
