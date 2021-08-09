import React from 'react';
import { useSession } from 'next-auth/client';
import moment from 'moment';
import { FaTimes, FaTrash } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';
import { ChatroomInviteButton } from '@/components';

import styles from './ChatMessage.module.scss';

export const ChatMessage = ({
  messageObject,
  showTimestamp,
  inDashboard,
  ...props
}) => {
  const { _id: chatMessageId, createdAt, owner, message } = messageObject;
  const { kickUser, deleteChat, openChatMessage, setOpenChatMessage } =
    useShow();
  const [session] = useSession();
  const { t } = useTranslation(['chat']);

  return (
    <div
      className={`${styles.container} ${
        openChatMessage?._id === chatMessageId
          ? styles['chatMessage--open']
          : ''
      }`}
      {...props}
    >
      {showTimestamp &&
        createdAt &&
        `${new moment(createdAt).format('HH:mm')} `}
      <button
        className={`button--unstyled ${styles.user}`}
        onClick={() => setOpenChatMessage(messageObject)}
        disabled={openChatMessage?._id === chatMessageId}
      >
        {owner?.username}:
      </button>{' '}
      <span className={styles.message}> {message}</span>
      {openChatMessage?._id === chatMessageId && (
        <div
          className={`${styles.actionMenu} ${
            inDashboard ? styles['actionMenu--inDashboard'] : ''
          }`}
        >
          {showTimestamp &&
            createdAt &&
            `${new moment(createdAt).format('HH:mm')} `}
          <button
            className={`button--unstyled ${styles.user} ${styles['user--open']}`}
            onClick={() => setOpenChatMessage(null)}
          >
            {owner?.username}
            {` ${
              owner?._id === session?.user?._id ? t('chat:you-indicator') : ''
            }`}
          </button>
          <button
            type="button"
            className={`button--icon ${styles.closeActionsButton}`}
            onClick={() => setOpenChatMessage(null)}
          >
            <FaTimes />
          </button>
          <div className={styles.actions}>
            {inDashboard ? (
              <>
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light`}
                  disabled={owner?._id === session?.user?._id}
                  onClick={() => kickUser({ userId: owner?._id })}
                >
                  <MdExitToApp size="1.6rem" />
                </button>
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light`}
                  onClick={() => deleteChat(chatMessageId)}
                >
                  <FaTrash size="1.2rem" />
                </button>
              </>
            ) : (
              <ChatroomInviteButton user={owner} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
