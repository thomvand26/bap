import React, { useEffect, useRef, useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';
import { AddButton, LoadingSpinner, PollSettingsForm } from '@/components';
import { DashboardPanel } from './DashboardPanel';

import styles from './PollPanel.module.scss';

const defaultPollValues = {
  pollTitle: 'New poll',
  options: [
    {
      voters: [],
      optionName: 'Option 1',
      position: 1,
    },
    {
      voters: [],
      optionName: 'Option 2',
      position: 2,
    },
  ],
  allowMultipleChoices: false,
  visible: false,
  showResults: false,
};

export const PollPanel = (props) => {
  const {
    loadingShow,
    currentShow,
    getPolls,
    currentPolls,
    setCurrentPolls,
    currentPoll,
    setCurrentPoll,
    loadingPolls,
    setLoadingPolls,
  } = useShow();
  const [saving, setSaving] = useState();
  const hasInitializedPolls = useRef();
  const { t } = useTranslation(['artist-dashboard']);

  const initializePolls = async () => {
    setLoadingPolls(true);
    const polls = await getPolls({ show: currentShow?._id });
    setCurrentPolls(polls);
    setLoadingPolls(false);
  };

  useEffect(() => {
    if (!currentShow) return;
    if (currentPolls?.length) return;
    if (hasInitializedPolls?.current) return;
    initializePolls();
    hasInitializedPolls.current = true;
  }, [currentShow, currentPolls]);

  return (
    <DashboardPanel
      name={t('artist-dashboard:polls')}
      contentClassName={styles.panelContainer}
      {...props}
    >
      {loadingShow || loadingPolls ? (
        <LoadingSpinner />
      ) : (
        <>
          <ul className={styles.pollList}>
            {currentPolls?.length ? (
              currentPolls.map((poll, i) => (
                <li
                  key={i}
                  className={`${styles.pollList__item} ${
                    currentPoll?._id === poll._id
                      ? styles['pollList__item--active']
                      : ''
                  }`}
                  onClick={() => setCurrentPoll(poll)}
                >
                  {poll.pollTitle}
                  {poll.visible ? (
                    <MdVisibility
                      size="1rem"
                      className={styles.pollList__visibleIcon}
                    />
                  ) : (
                    ''
                  )}
                </li>
              ))
            ) : (
              <div className={`${styles.placeholder}`}>
                {t('artist-dashboard:no-polls-yet')}
              </div>
            )}
            <li className={styles.addButton}>
              <AddButton
                onClick={() => setCurrentPoll(defaultPollValues)}
                disabled={saving}
              />
            </li>
          </ul>
          <PollSettingsForm saving={saving} setSaving={setSaving} />
        </>
      )}
    </DashboardPanel>
  );
};
