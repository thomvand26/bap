import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';

import { useShow } from '@/context';

import styles from './ChatroomInviteButton.module.scss';

export const ChatroomInviteButton = ({ user }) => {
  const { ownChatroom, inviteToChatroom, kickFromChatroom } = useShow();
  const [session] = useSession();

  const [isInvited, setIsInvited] = useState();
  const [isMember, setIsMember] = useState();

  useEffect(() => {
    setIsInvited(
      !!ownChatroom?.invitedUsers?.find(
        (invitedUser) =>
          `${invitedUser?._id || invitedUser}` === `${user?._id || user}`
      )
    );

    setIsMember(
      !!ownChatroom?.members.find(
        (member) => `${member?._id || member}` === `${user?._id || user}`
      )
    );
  }, [ownChatroom, user]);

  const handleUserAction = ({ isMember, isInvited }) => {
    switch (true) {
      case isMember:
        // Kick from room
        console.log('Kick from room');
        kickFromChatroom({
          userId: user?._id || user,
          chatroomId: ownChatroom._id,
        });
        break;
      case isInvited:
        // Cancel invite
        console.log('Cancel invite');
        inviteToChatroom({
          chatroomId: ownChatroom._id,
          userId: user?._id || user,
          cancel: true,
        });
        break;

      default:
        inviteToChatroom({
          chatroomId: ownChatroom._id,
          userId: user?._id || user,
        });
        break;
    }
  };

  return (
    ownChatroom && (
      <button
        type="button"
        className={`button--mini ${
          isMember || isInvited ? 'button--ghost' : ''
        } ${styles.inviteButton} ${
          isMember || isInvited ? styles['inviteButton--ghost'] : ''
        }`}
        disabled={(user?._id || user) === session?.user?._id}
        onClick={() => handleUserAction({ isMember, isInvited })}
      >
        {isMember
          ? `Kick from ${ownChatroom?.name}`
          : isInvited
          ? 'Cancel invite'
          : `Invite to ${ownChatroom?.name}`}
      </button>
    )
  );
};
