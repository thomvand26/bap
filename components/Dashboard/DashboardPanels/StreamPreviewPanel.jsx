import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';
import { PollWindow } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './StreamPreviewPanel.module.scss';

export const StreamPreviewPanel = ({ isPerformance, ...props }) => {
  const { currentShow } = useShow();
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);
  const { t } = useTranslation(['artist-dashboard']);

  useEffect(() => {
    setUrlValid(currentShow?.streamURL);
  }, [currentShow?.streamURL]);

  return (
    <DashboardPanel name={t('artist-dashboard:preview')} {...props}>
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
          <div className="centeredPlaceholder">
            {t('artist-dashboard:invalid-stream-url')}
          </div>
        )}
        <PollWindow />
      </div>
    </DashboardPanel>
  );
};
