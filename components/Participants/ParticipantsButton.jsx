import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { FaBan, FaUser } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';

import { useShow } from '@/context/ShowContext';

import styles from './ParticipantsButton.module.scss';

export const ParticipantsButton = ({ inDashboard }) => {
  const { currentShow, kickPlayer } = useShow();
  const [showParticipants, setShowParticipants] = useState(false);
  const [session] = useSession();

  return (
    <div
      className={`${styles.container} ${
        inDashboard ? styles['container--inDashboard'] : ''
      } ${showParticipants ? styles['container--open'] : ''}`}
    >
      <button
        type="button"
        className={`button--mini ${styles.button}`}
        onClick={() => setShowParticipants((prev) => !prev)}
      >
        <FaUser className={styles.icon} />
        {currentShow?.connectedUsers
          ? Object.keys(currentShow?.connectedUsers)?.length
          : 0}
      </button>
      {showParticipants && currentShow?.connectedUsers && (
        <ul className={styles.userList}>
          {Object.values(currentShow.connectedUsers).map((userObject, i) => (
            <li key={`userObject ${i}`}>
              <div>
                {userObject?.user?.username}{' '}
                {userObject?.user?._id === session?.user?._id ? (
                  <span>(you)</span>
                ) : (
                  ''
                )}
              </div>
              <div className={styles.actionButtons}>
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light ${styles.actionButton} ${styles['actionButton--ban']}`}
                  disabled={userObject?.user?._id === session?.user?._id}
                >
                  <FaBan size="1.2rem" />
                </button>
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
                  disabled={userObject?.user?._id === session?.user?._id}
                  onClick={() => kickPlayer({ userId: userObject?.user?._id })}
                >
                  <MdExitToApp size="1.6rem" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
