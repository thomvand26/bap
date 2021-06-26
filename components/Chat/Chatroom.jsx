import React, { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/client';

import { useShow } from '@/context';
import { ParticipantsButton } from '@/components';
import { ChatMessage } from './ChatMessage';

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
  const { currentChatroom } = useShow();
  const chatContentRef = useRef();
  const wasScrolledToBottom = useRef(true);
  const [session] = useSession();

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

  return (
    <div className={`${styles.container}`}>
      {!inDashboard && (
        <div className={styles.chatHeader}>
          <h2 className={`h3 ${styles.chatHeader__title}`}>General chat</h2>
          <div className={styles.chatHeader__actions}>
            <button
              type="button"
              className={`button--primary button--mini ${styles.chatHeader__makeRoom}`}
            >
              Make room
            </button>
            <ParticipantsButton />
          </div>
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
        {currentChatroom?.messages?.map?.((messageObject, i) => {
          return (
            <ChatMessage
              key={`message-${i}-${messageObject?._id}`}
              messageObject={messageObject}
              showTimestamp={inDashboard}
              inDashboard={inDashboard}
              userId={session?.user?._id}
            />
          );
        })}
      </div>
    </div>
  );
};
