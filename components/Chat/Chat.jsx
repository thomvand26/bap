import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdArrowDropDown, MdExitToApp } from 'react-icons/md';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';
import { LANDING } from '@/routes';
import { SongRequestList } from '@/components';
import { Chatroom } from './Chatroom';
import { Chatbox } from './Chatbox';

import styles from './Chat.module.scss';

export const Chat = () => {
  const { currentShow, loadingChat } = useShow();
  const { t } = useTranslation(['chat']);

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
          <a
            className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
          >
            <MdExitToApp size="1.5rem" />
          </a>
        </Link>
      </div>
      <div
        className={`${styles.requests} ${
          minimizeShowRequests ? styles['requests--minimized'] : ''
        }`}
      >
        <button
          type="button"
          className={`button--text ${styles.requests__titleButton}`}
          onClick={() => setMinimizeShowRequests((prev) => !prev)}
        >
          <h2 className={`h4 ${styles.requests__title}`}>
            {t('chat:song-requests')}
          </h2>
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
