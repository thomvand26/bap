import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import { MdExitToApp } from 'react-icons/md';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation(['chat']);

  const [showInviteMenu, setShowInviteMenu] = useState([]);
  const [loading, setLoading] = useState();

  const handleKick = async (userId) => {
    setLoading(true);
    await kickUser({ userId });
    setLoading(false);
  };

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
            const isCurrentUser = userObject?._id === session?.user?._id;

            return (
              <li
                key={`userObject-${userObject?._id}-${i}`}
                className={styles.userObject}
              >
                <div>
                  {userObject?.username}{' '}
                  {isCurrentUser ? <span>{t('chat:you-indicator')}</span> : ''}
                </div>
                <div
                  className={`${styles.actionButtons} ${styles.actionButtons}`}
                >
                  {inDashboard ? (
                    <button
                      type="button"
                      className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
                      disabled={isCurrentUser || loading}
                      onClick={() => handleKick(userObject?._id)}
                    >
                      <MdExitToApp size="1.6rem" />
                    </button>
                  ) : ownChatroom && !inChatroom ? (
                    <button
                      className="button button--icon button--dark focus-inset"
                      disabled={isCurrentUser || showInviteMenu.includes(userObject?._id)}
                      onClick={() =>
                        setShowInviteMenu((prev) => {
                          return showInviteMenu.includes(userObject?._id)
                            ? prev
                            : [...prev, userObject?._id];
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
                          userId: userObject?._id,
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
                        showInviteMenu.includes(userObject?._id)
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
                            prev.filter((userId) => userId !== userObject?._id)
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
