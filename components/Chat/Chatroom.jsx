import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/client';
import { FiSettings } from 'react-icons/fi';
import { MdArrowDropDown } from 'react-icons/md';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';
import { ParticipantsButton, LoadingSpinner } from '@/components';
import { ChatMessage } from './ChatMessage';
import { ChatroomSettings } from './ChatroomSettings';
import { ChatModal } from './ChatModal';

import styles from './Chatroom.module.scss';

export const chatroomTypes = {
  general: 'general',
};

export const chatroomModes = {
  small: '0',
  default: '1',
  large: '2',
  full: '3',
};

export const Chatroom = ({ inDashboard }) => {
  const {
    currentChatroom,
    setShowChatroomSettings,
    availableChatrooms,
    joinChatroom,
    loadingChat,
    loadingShow,
  } = useShow();
  const chatContentRef = useRef();
  const wasScrolledToBottom = useRef(true);
  const [session] = useSession();
  const { t } = useTranslation(['chat']);

  const [showAvailableChatrooms, setShowAvailableChatrooms] = useState(false);

  useEffect(() => {
    if (!chatContentRef?.current) return;

    // Scroll to bottom if the content was scrolled to the bottom before receiving a new message
    if (wasScrolledToBottom.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [currentChatroom?.messages]);

  const checkIsScrolledToBottom = (element) => {
    wasScrolledToBottom.current =
      element.scrollHeight - element.scrollTop === element.clientHeight;
  };

  const handelChangeChatroom = async (chatroomId) => {
    await joinChatroom(chatroomId);
    setShowAvailableChatrooms(false);
  };

  return (
    <div
      className={`${styles.container} ${
        inDashboard ? styles['container--inDashboard'] : ''
      }`}
    >
      {(loadingChat || loadingShow) && (
        <div
          className={`${styles.loadingContainer} ${
            !inDashboard ? styles['loadingContainer--dark'] : ''
          }`}
        >
          <LoadingSpinner />
        </div>
      )}
      {!inDashboard && (
        <div className={styles.chatHeader}>
          <button
            className={`button--unstyled ${styles.chatHeader__titleButton}`}
            onClick={() =>
              setShowAvailableChatrooms((prev) =>
                availableChatrooms?.length > 1 ? !prev : false
              )
            }
          >
            <h2
              className={`h3 ${styles.chatHeader__title} ${
                availableChatrooms?.length > 1
                  ? styles['chatHeader__title--withList']
                  : ''
              }`}
            >
              {currentChatroom?.isGeneral
                ? t('chat:general-chat')
                : currentChatroom?.name}
              {availableChatrooms?.length > 1 && (
                <MdArrowDropDown
                  className={`dropdownIcon ${
                    showAvailableChatrooms ? 'open' : ''
                  }`}
                  viewBox="6 6 12 12"
                />
              )}
            </h2>
          </button>
          <div className={styles.chatHeader__actions}>
            {!availableChatrooms?.find?.(
              (chatroom) =>
                (chatroom.owner?._id || chatroom.owner) ===
                  session?.user?._id && !chatroom.isGeneral
            ) && (
              <button
                type="button"
                className={`button--primary button--mini ${styles.chatHeader__makeRoom}`}
                onClick={() => setShowChatroomSettings('create')}
              >
                {t('chat:make-room')}
              </button>
            )}
            <ParticipantsButton />
          </div>
          <ChatroomSettings />
        </div>
      )}
      <div
        className={`${styles.content} ${
          inDashboard ? styles['content--inDashboard'] : ''
        }`}
        ref={chatContentRef}
        onScroll={() => {
          checkIsScrolledToBottom(chatContentRef.current);
        }}
      >
        {showAvailableChatrooms && (
          <ul className={styles.chatHeader__chatroomList}>
            {availableChatrooms?.map?.((chatroom, i) => (
              <li
                key={chatroom?._id || i}
                className={`${styles.chatHeader__chatroomListItem} ${
                  chatroom?._id === currentChatroom?._id
                    ? styles['chatHeader__chatroomListItem--disabled']
                    : ''
                }`}
              >
                <button
                  className="button--unstyled focus-inset"
                  onClick={() => handelChangeChatroom(chatroom._id)}
                  disabled={chatroom?._id === currentChatroom?._id}
                >
                  {chatroom.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!currentChatroom?.isGeneral && !inDashboard && (
          <button
            type="button"
            className={`button--icon ${styles.settingsButton}`}
            onClick={() => setShowChatroomSettings('edit')}
          >
            <FiSettings size="1.4rem" />
          </button>
        )}

        {!inDashboard && <ChatModal />}

        {!loadingChat && !loadingShow && !currentChatroom?.messages?.length && (
          <div className="centeredPlaceholder">{t('chat:no-messages-yet')}</div>
        )}

        {currentChatroom?.messages?.map?.((messageObject, i) => {
          return (
            <ChatMessage
              key={`message-${i}-${messageObject?._id}`}
              messageObject={messageObject}
              showTimestamp={inDashboard}
              inDashboard={inDashboard}
            />
          );
        })}
      </div>
    </div>
  );
};
