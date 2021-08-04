import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';

import styles from './ChatModal.module.scss';

export const ChatModal = () => {
  const [session] = useSession();
  const { chatModalQueue, setChatModalQueue, joinChatroom, inviteToChatroom } =
    useShow();
  const { t } = useTranslation(['chat']);

  const [currentChatModalData, setCurrentChatModalData] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    setCurrentChatModalData(chatModalQueue[0]);
  }, [chatModalQueue]);

  const removeCurrentFromQueue = () => {
    setChatModalQueue((prev) =>
      prev.filter((chatModalData) => chatModalData !== currentChatModalData)
    );
  };

  const declineInvite = async () => {
    if (loading) return;
    setLoading(true);
    await inviteToChatroom({
      chatroomId: currentChatModalData?.chatroomId,
      userId: session?.user?._id,
      cancel: true,
    });
    removeCurrentFromQueue();
    setLoading(false);
  };

  const acceptInvite = async () => {
    if (loading) return;
    setLoading(true);
    await joinChatroom(currentChatModalData?.chatroomId);
    setLoading(false);
  };

  return currentChatModalData ? (
    currentChatModalData?.type === 'invite' && (
      <fieldset className={styles.container} disabled={loading}>
        <button
          type="button"
          className={`button--icon button--lightest ${styles.closeButton}`}
          onClick={declineInvite}
        >
          <FaTimes />
        </button>
        <div className={styles.message}>
          {`${currentChatModalData.owner} ${t('chat:invited-you-to-join')} ${
            currentChatModalData.chatroomName
          }.`}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`button--primary button--mini`}
            onClick={acceptInvite}
          >
            {t('chat:join-room')}
          </button>
          <button
            type="button"
            className={`button--primary button--mini`}
            onClick={declineInvite}
          >
            {t('chat:decline-room')}
          </button>
        </div>
      </fieldset>
    )
  ) : (
    <></>
  );
};
