import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { FaBan, FaTimes, FaUserPlus } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';

import { useShow } from '@/context';
import { ChatroomInviteButton } from '@/components';

import styles from './ParticipantsList.module.scss';

export const ParticipantsList = ({
  inDashboard,
  inChatroom,
  isOwnChatroom,
  setShowParticipants,
}) => {
  const [session] = useSession();
  const {
    uniqueParticipants,
    uniqueParticipantsInChatroom,
    kickUser,
    kickFromChatroom,
    ownChatroom,
  } = useShow();
  const [showInviteMenu, setShowInviteMenu] = useState([]);

  return true ? (
    <div
      className={`${styles.userListContainer} ${
        inChatroom ? styles['userListContainer--inChatroom'] : ''
      } ${inDashboard ? styles['userListContainer--inDashboard'] : ''}`}
    >
      {!inChatroom && (
        <button
          type="button"
          className={`button--icon ${!inDashboard ? 'button--lighter' : ''} ${
            styles?.closeButton
          }`}
          onClick={() => {
            setShowParticipants?.(false);
          }}
        >
          <FaTimes />
        </button>
      )}
      <ul className={`${styles.userList}`}>
        {!(inChatroom ? uniqueParticipantsInChatroom : uniqueParticipants)
          .length && 'No participants yet'}
        {(inChatroom ? uniqueParticipantsInChatroom : uniqueParticipants).map(
          (userObject, i) => {
            const isCurrentUser = userObject._id === session?.user?._id;

            return (
              <li
                key={`userObject-${userObject?._id}-${i}`}
                className={styles.userObject}
              >
                <div>
                  {userObject.username}{' '}
                  {isCurrentUser ? <span>(you)</span> : ''}
                </div>
                <div
                  className={`${styles.actionButtons} ${styles.actionButtons}`}
                >
                  <button
                    type="button"
                    className={`button button--icon button--danger button--hover-light ${styles.actionButton} ${styles['actionButton--ban']}`}
                    disabled={isCurrentUser}
                  >
                    <FaBan size="1.2rem" />
                  </button>
                  {inDashboard ? (
                    <button
                      type="button"
                      className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
                      disabled={isCurrentUser}
                      onClick={() => kickUser({ userId: userObject._id })}
                    >
                      <MdExitToApp size="1.6rem" />
                    </button>
                  ) : ownChatroom && !inChatroom ? (
                    <button
                      className="button button--icon button--dark focus-inset"
                      disabled={isCurrentUser}
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
                  ) : isOwnChatroom ? (
                    <button
                      type="button"
                      className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
                      disabled={isCurrentUser}
                      onClick={() =>
                        kickFromChatroom({
                          userId: userObject._id,
                          chatroomId: ownChatroom._id,
                        })
                      }
                    >
                      <MdExitToApp size="1.6rem" />
                    </button>
                  ) : (
                    <></>
                  )}
                  {!inDashboard && ownChatroom && !inChatroom && (
                    <div
                      className={`${styles.inviteMenu} ${
                        showInviteMenu.includes(userObject._id)
                          ? styles['inviteMenu--show']
                          : ''
                      }`}
                    >
                      <ChatroomInviteButton user={userObject} />
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
            );
          }
        )}
      </ul>
    </div>
  ) : (
    <div>No participants</div>
  );
};
