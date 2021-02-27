import React, { useState } from 'react';
import { ChatView, chatViewTypes } from './ChatView';
import styles from './Chat.module.scss';

export const Chat = () => {
  const [enableGeneral, setEnableGeneral] = useState(true);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chats}>
        {enableGeneral && <ChatView type={chatViewTypes.general} />}
      </div>
    </div>
  );
};
