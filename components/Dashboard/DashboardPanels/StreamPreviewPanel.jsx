import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

import { useShow } from '@/context';
import { DashboardPanel } from './DashboardPanel';

export const StreamPreviewPanel = (props) => {
  const { currentShow } = useShow();
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);

  useEffect(() => {
    setUrlValid(currentShow?.streamURL);
  }, [currentShow?.streamURL]);

  return (
    <DashboardPanel {...props}>
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
    </DashboardPanel>
  );
};
