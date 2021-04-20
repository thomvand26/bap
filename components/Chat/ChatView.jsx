import React, { useEffect, useRef, useState } from 'react';
import { useShow } from '@/context';
import styles from './ChatView.module.scss';

export const chatViewTypes = {
  general: 'general',
};

export const chatViewModes = {
  small: '0',
  default: '1',
  large: '2',
  full: '3',
};

export const ChatView = ({ type = chatViewTypes.general }) => {
  const { currentShow, sendChat } = useShow();
  const [mode, setMode] = useState(chatViewModes.default);
  const [show, setShow] = useState(true);
  const chatContentRef = useRef();

  useEffect(() => {
    if (!chatContentRef?.current) return;
    chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  }, [currentShow]);

  const handelToggleShow = () => setShow((prev) => !prev);

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = event.target['chatMessage'].value?.trim();

    // Reset the form inputs
    event.target.reset();

    if (message?.length) {
      sendChat(type, message);
    }
  };

  return (
    <div
      className={`${styles.container} ${
        !show ? styles['container--hide'] : ''
      }`}
    >
      <div className={styles.chatHeader}>
        <h2 onClick={handelToggleShow}>CHATVIEW {type}</h2>
      </div>
      <div className={styles.content} ref={chatContentRef}>
        {currentShow?.chats?.[type]?.map?.((message, i) => {
          return (
            <div key={i} className={styles.chatMessage}>
              {message}
            </div>
          );
        })}
      </div>
      <form className={styles.chatForm} onSubmit={handleSubmit}>
        <input
          className={styles.chatForm__input}
          type="text"
          placeholder="Say something!"
          id="chatMessage"
          autoComplete="off"
        />
        <button className={styles.chatForm__sendButton}>Send</button>
      </form>
    </div>
  );
};
