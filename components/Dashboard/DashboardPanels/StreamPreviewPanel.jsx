import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useTranslation } from 'next-i18next';

import { useShow, useCookies } from '@/context';
import { PollWindow } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './StreamPreviewPanel.module.scss';

export const StreamPreviewPanel = ({ isPerformance, ...props }) => {
  const { currentShow } = useShow();
  const [urlValid, setUrlValid] = useState(currentShow?.streamURL);
  const { t } = useTranslation(['artist-dashboard']);
  const { cookieValues, setCookieValues } = useCookies();

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
          cookieValues?.youtube === true ? (
            <ReactPlayer
              url={
                currentShow?.streamURL?.includes?.('youtube.') ||
                currentShow?.streamURL?.includes?.('youtu.be')
                  ? currentShow.streamURL
                  : null
              }
              width="100%"
              height="100%"
              onError={() => {
                setUrlValid(false);
              }}
            />
          ) : (
            <div className="centeredPlaceholder centeredPlaceholder--withButton centeredPlaceholder--withPadding">
              {t('cookies:youtube-cookies-needed')}
              <button
                type="button"
                className="button--primary"
                onClick={() =>
                  setCookieValues((prev) => ({ ...prev, youtube: true }))
                }
              >
                {t('cookies:youtube-cookies-allow')}
              </button>
            </div>
          )
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
