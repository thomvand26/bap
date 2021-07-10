import React from 'react';
import Link from 'next/link';
import { MdExitToApp } from 'react-icons/md';

import { useShow } from '@/context';
import { LANDING } from '@/routes';
import { Chatroom } from './Chatroom';
import { Chatbox } from './Chatbox';

import styles from './Chat.module.scss';

export const Chat = () => {
  const { currentShow, loadingChat } = useShow();

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
      <div className={styles.requests}>Song requests</div>
      <div className={styles.chats}>
        <Chatroom />
      </div>
      <div className={styles.chatbox}>
        {loadingChat && <div className={styles.loadingChatboxOverlay}></div>}

        <Chatbox />
      </div>
    </div>
  );
};
