import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { FiClipboard } from 'react-icons/fi';

import { appConfig } from '@/config';
import { SHOW } from '@/routes';
import { useShow } from '@/context';
import { LoadingSpinner } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './SharePanel.module.scss';

export const SharePanel = (props) => {
  const { currentShow } = useShow();
  const { t } = useTranslation(['artist-dashboard']);
  const linkRef = useRef();
  const shareUrl = `${appConfig.baseUrl}${SHOW}/${currentShow?._id}`;

  const handleLinkClick = (event) => {
    if (typeof window === 'undefined') return;

    // Select text
    const range = document.createRange();
    range.selectNode(linkRef?.current);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  };

  const handleClipboardClick = (event) => {
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <DashboardPanel {...props}>
      {!currentShow?._id ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.container}>
          <h2 className={styles.title}>{t('artist-dashboard:share-title')}</h2>
          <div className={styles.link} onClick={handleLinkClick} ref={linkRef}>
            {shareUrl}
            <button
              type="button"
              className={`button--icon ${styles.clipboardButton}`}
              onClick={handleClipboardClick}
            >
              <FiClipboard size="1.5rem" />
            </button>
          </div>
        </div>
      )}
    </DashboardPanel>
  );
};
