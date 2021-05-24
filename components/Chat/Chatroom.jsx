import React, { useEffect, useRef, useState } from 'react';

import { useShow } from '@/context';
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

export const Chatroom = () => {
  const { currentShow, currentChatroom, sendChat } = useShow();
  const chatContentRef = useRef();
  const wasScrolledToBottom = useRef(true);

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
      <div className={styles.chatHeader}>
        <h2>General chat</h2>
      </div>
      <div
        className={styles.content}
        ref={chatContentRef}
        onScroll={() => {
          checkIsScrolledToBottom(chatContentRef.current);
        }}
      >
        {currentChatroom?.messages?.map?.((messageObject, i) => {
          return <ChatMessage key={i} messageObject={messageObject} />;
        })}
      </div>
    </div>
  );
};
