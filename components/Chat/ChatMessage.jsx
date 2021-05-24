import React from 'react';

import styles from './ChatMessage.module.scss';

export const ChatMessage = ({
  messageObject: { owner, message },
  ...props
}) => {
  return (
    <div className={styles.chatMessage} {...props}>
      <strong className={styles.chatMessage__user}>{owner?.username}:</strong>{' '}
      <span className={styles.chatMessage__message}> {message}</span>
    </div>
  );
};
