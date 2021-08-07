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
      className={`${styles.chatMessage} ${
        openChatMessage?._id === chatMessageId
          ? styles['chatMessage--open']
          : ''
      }`}
      {...props}
    >
      {showTimestamp &&
        createdAt &&
        `${new moment(createdAt).format('HH:mm')} `}
      <strong
        className={styles.chatMessage__user}
        onClick={() => setOpenChatMessage(messageObject)}
      >
        {owner?.username}:
      </strong>{' '}
      <span className={styles.chatMessage__message}> {message}</span>
      {openChatMessage?._id === chatMessageId && (
        <div
          className={`${styles.chatMessage__actionMenu} ${
            inDashboard ? styles['chatMessage__actionMenu--inDashboard'] : ''
          }`}
        >
          {showTimestamp &&
            createdAt &&
            `${new moment(createdAt).format('HH:mm')} `}
          <strong
            className={styles.chatMessage__user}
            onClick={() => setOpenChatMessage(null)}
          >
            {owner?.username}
            {` ${
              owner?._id === session?.user?._id ? t('chat:you-indicator') : ''
            }`}
          </strong>
          <button
            type="button"
            className={`button--icon ${styles.chatMessage__closeActionsButton}`}
            onClick={() => setOpenChatMessage(null)}
          >
            <FaTimes />
          </button>
          <div className={styles.chatMessage__actions}>
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
