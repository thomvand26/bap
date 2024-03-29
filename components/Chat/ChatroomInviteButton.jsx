import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useTranslation } from 'next-i18next';

import { useShow } from '@/context';

import styles from './ChatroomInviteButton.module.scss';

export const ChatroomInviteButton = ({ user }) => {
  const { ownChatroom, inviteToChatroom, kickFromChatroom } = useShow();
  const [session] = useSession();
  const { t } = useTranslation(['chat']);

  const [isInvited, setIsInvited] = useState();
  const [isMember, setIsMember] = useState();
  const [handlingAction, setHandlingAction] = useState(false);

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

  const handleUserAction = async ({ isMember, isInvited }) => {
    if (handlingAction) return;

    setHandlingAction(true);

    switch (true) {
      case isMember:
        // Kick from room
        await kickFromChatroom({
          userId: user?._id || user,
          chatroomId: ownChatroom._id,
        });
        break;
      case isInvited:
        // Cancel invite
        await inviteToChatroom({
          chatroomId: ownChatroom._id,
          userId: user?._id || user,
          cancel: true,
        });
        break;

      default:
        await inviteToChatroom({
          chatroomId: ownChatroom._id,
          userId: user?._id || user,
        });
        break;
    }

    setHandlingAction(false);
  };

  return ownChatroom ? (
    <button
      type="button"
      className={`button--mini ${
        isMember || isInvited ? 'button--ghost' : ''
      } ${styles.inviteButton} ${
        isMember || isInvited ? styles['inviteButton--ghost'] : ''
      } `}
      disabled={(user?._id || user) === session?.user?._id || handlingAction}
      onClick={() => handleUserAction({ isMember, isInvited })}
    >
      {isMember
        ? `${t('chat:kick-from')} ${ownChatroom?.name}`
        : isInvited
        ? t('chat:cancel-invite')
        : `${t('chat:invite-to')} ${ownChatroom?.name}`}
    </button>
  ) : (
    <div className={styles.noOwnRoom}>{t('chat:create-room-to-invite')}</div>
  );
};
