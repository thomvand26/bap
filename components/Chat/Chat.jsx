import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdArrowDropDown, MdExitToApp } from 'react-icons/md';

import { useShow } from '@/context';
import { LANDING } from '@/routes';
import { SongRequestList } from '@/components';
import { Chatroom } from './Chatroom';
import { Chatbox } from './Chatbox';

import styles from './Chat.module.scss';

export const Chat = () => {
  const { currentShow, loadingChat } = useShow();

  const [showSongRequestChatbox, setShowSongRequestChatbox] = useState(false);
  const [minimizeShowRequests, setMinimizeShowRequests] = useState(false);
  const [reachedSongRequestLimit, setReachedSongRequestLimit] = useState(false);

  useEffect(() => {
    setShowSongRequestChatbox((prev) =>
      reachedSongRequestLimit ? false : prev
    );
  }, [reachedSongRequestLimit]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.topSection}>
        {currentShow?.title && (
          <h1 className={styles.showTitle}>{currentShow.title}</h1>
        )}
        <Link href={LANDING}>
          <MdExitToApp
            className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
            size="1.8rem"
          />
        </Link>
      </div>
      <div
        className={`${styles.requests} ${
          minimizeShowRequests ? styles['requests--minimized'] : ''
        }`}
      >
        <button
          type="button"
          className={`button--text focus-inset ${styles.requests__titleButton}`}
          onClick={() => setMinimizeShowRequests((prev) => !prev)}
        >
          <h2 className={`h4 ${styles.requests__title}`}>Song requests</h2>
          <MdArrowDropDown
            className={`dropdownIcon ${!minimizeShowRequests ? 'open' : ''}`}
            viewBox="6 6 12 12"
          />
        </button>
        {!minimizeShowRequests && <SongRequestList />}
      </div>
      <div className={styles.chats}>
        <Chatroom />
      </div>
      <div
        className={`${styles.chatbox} ${
          showSongRequestChatbox ? styles['chatbox--songRequest'] : ''
        }`}
      >
        {loadingChat && <div className={styles.loadingChatboxOverlay}></div>}

        <Chatbox
          showSongRequestChatbox={showSongRequestChatbox}
          setShowSongRequestChatbox={setShowSongRequestChatbox}
          setReachedSongRequestLimit={setReachedSongRequestLimit}
        />
      </div>
    </div>
  );
};
