import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { FaBan, FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';

import { useShow } from '@/context';

import styles from './ParticipantsButton.module.scss';

export const ParticipantsButton = ({ inDashboard }) => {
  const { currentShow, kickPlayer } = useShow();
  const [showParticipants, setShowParticipants] = useState(false);
  const [session] = useSession();
  const [showInviteMenu, setShowInviteMenu] = useState([]);
  const [uniqueParticipants, setUniqueParticipants] = useState([]);

  useEffect(() => {
    if (!currentShow?.connectedUsers) return;
    let userObjects = new Map();
    Object.values(currentShow.connectedUsers).forEach((userObject, i) => {
      userObjects.set(userObject.user?._id, userObject.user);
    });
    setUniqueParticipants(
      Array.from(userObjects.values()).sort((userObjectA, userObjectB) =>
        userObjectA?.username?.localeCompare?.(userObjectB?.username)
      )
    );
  }, [currentShow]);

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
        {uniqueParticipants.length || 0}
      </button>
      {showParticipants && currentShow?.connectedUsers && (
        <ul className={styles.userList}>
          {uniqueParticipants.map((userObject, i) => (
            <li key={`userObject ${i}`} className={styles.userObject}>
              <div>
                {userObject.username}{' '}
                {userObject._id === session?.user?._id ? (
                  <span>(you)</span>
                ) : (
                  ''
                )}
              </div>
              <div
                className={`${styles.actionButtons} ${styles.actionButtons}`}
              >
                <button
                  type="button"
                  className={`button button--icon button--danger button--hover-light ${styles.actionButton} ${styles['actionButton--ban']}`}
                  disabled={userObject._id === session?.user?._id}
                >
                  <FaBan size="1.2rem" />
                </button>
                {inDashboard ? (
                  <button
                    type="button"
                    className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
                    disabled={userObject._id === session?.user?._id}
                    onClick={() => kickPlayer({ userId: userObject._id })}
                  >
                    <MdExitToApp size="1.6rem" />
                  </button>
                ) : (
                  // TODO: only show if the users owns a room
                  <button
                    className="button button--icon button--dark"
                    disabled={userObject._id === session?.user?._id}
                    onClick={() =>
                      setShowInviteMenu((prev) => {
                        return showInviteMenu.includes(userObject._id)
                          ? prev
                          : [...prev, userObject._id];
                      })
                    }
                  >
                    <FaUserPlus size="1.4rem" />
                  </button>
                )}
                {!inDashboard && (
                  <div
                    className={`${styles.inviteMenu} ${
                      showInviteMenu.includes(userObject._id)
                        ? styles['inviteMenu--show']
                        : ''
                    }`}
                  >
                    {/* TODO: also used in ChatMessage.jsx */}
                    <button
                      type="button"
                      className={`button--mini ${styles.inviteButton}`}
                      // TODO: find own room
                    >{`Invite to ${'My custom room'}`}</button>

                    <button
                      type="button"
                      className={`button--icon button--lighter`}
                      onClick={() => {
                        setShowInviteMenu((prev) =>
                          prev.filter((userId) => userId !== userObject._id)
                        );
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
