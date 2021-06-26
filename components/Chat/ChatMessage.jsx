import React from 'react';
import { FaBan, FaTimes, FaTrash } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
import moment from 'moment';

import { useShow } from '@/context';

import styles from './ChatMessage.module.scss';

export const ChatMessage = ({
  messageObject,
  showTimestamp,
  userId,
  inDashboard,
  ...props
}) => {
  const { _id: chatMessageId, createdAt, owner, message } = messageObject;
  const { kickPlayer, deleteChat, openChatMessage, setOpenChatMessage } = useShow();

  return (
    <div
      className={`${styles.chatMessage} ${
        openChatMessage?._id === chatMessageId ? styles['chatMessage--open'] : ''
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
                  disabled={owner?._id === userId}
                >
                  <FaBan size="1.2rem" />
                </button>
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light`}
                  disabled={owner?._id === userId}
                  onClick={() => kickPlayer({ userId: owner?._id })}
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
              <>
                <button
                  type="button"
                  className={`button--mini ${styles.chatMessage__inviteButton}`}
                  disabled={owner?._id === userId}
                  // TODO: find own room
                >{`Invite to ${'My custom room'}`}</button>
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light`}
                  disabled={owner?._id === userId}
                >
                  <FaBan size="1.2rem" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
