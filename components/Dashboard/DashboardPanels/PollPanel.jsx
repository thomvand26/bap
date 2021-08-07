import React, { useEffect, useRef, useState } from 'react';
import { MdVisibility } from 'react-icons/md';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

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
  const hasInitializedPolls = useRef();
  const { t } = useTranslation(['artist-dashboard']);
  const router = useRouter();

  const [saving, setSaving] = useState();
  const [loading, setLoading] = useState();

  const initializePolls = async () => {
    if (loading) return;
    setLoadingPolls(true);
    setLoading(true);
    const polls = await getPolls({ show: router.query?.showId });
    setCurrentPolls(polls);
    setLoadingPolls(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query?.showId) return;
    if (currentPolls?.length) return;
    if (hasInitializedPolls?.current) return;
    initializePolls();
    hasInitializedPolls.current = true;
  }, [router.isReady, currentPolls]);

  return (
    <DashboardPanel
      name={t('artist-dashboard:polls')}
      contentClassName={styles.panelContainer}
      {...props}
    >
      {loadingShow || loadingPolls || loading ? (
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
