import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import FocusTrap from 'focus-trap-react';

import { useShow } from '@/context';
import { Input, ParticipantsList } from '@/components';

import styles from './ChatroomSettings.module.scss';

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().max(16),
});

export const ChatroomSettings = () => {
  const {
    currentChatroom,
    showChatroomSettings,
    setShowChatroomSettings,
    createChatroom,
    deleteChatroom,
    updateChatroom,
    leaveChatroom,
    uniqueParticipantsInChatroom,
    loadingChat,
  } = useShow();
  const [session] = useSession();
  const { t } = useTranslation(['chat']);

  const [chatroomName, setChatroomName] = useState(t('chat:default-room-name'));
  const [saving, setSaving] = useState();

  useEffect(() => {
    setChatroomName((prev) => currentChatroom?.name || prev);
  }, [currentChatroom]);

  const handleSubmit = async (data) => {
    if (loadingChat) return;
    if (saving) return;
    setSaving(true);
    if (showChatroomSettings === 'create') {
      await createChatroom(data);
    } else {
      await updateChatroom(data);
    }
    setSaving(false);
  };

  const handleDelete = () => {
    if (loadingChat) return;
    if (saving) return;
    setSaving(true);
    deleteChatroom({ chatroomId: currentChatroom?._id });
    setSaving(false);
  };

  const handleLeave = () => {
    if (loadingChat) return;
    if (saving) return;
    setSaving(true);
    leaveChatroom(currentChatroom?._id);
    setSaving(false);
  };

  return showChatroomSettings ? (
    <FocusTrap>
      <div className={styles?.container}>
        <div className={styles?.top}>
          <h3>
            {currentChatroom?.isGeneral ? t('chat:general-chat') : chatroomName}
          </h3>
          <button
            type="button"
            className={`button--icon button--lightest ${styles.closeButton}`}
            onClick={() => setShowChatroomSettings(false)}
          >
            <FaTimes />
          </button>
        </div>
        {(currentChatroom?.owner?._id === session?.user?._id ||
          showChatroomSettings === 'create') && (
          <Formik
            validationSchema={validationSchema}
            enableReinitialize={true}
            initialValues={{
              name:
                showChatroomSettings === 'create'
                  ? t('chat:default-room-name')
                  : currentChatroom?.name,
            }}
            onSubmit={handleSubmit}
          >
            <Form>
              <fieldset
                className={styles.fieldset}
                disabled={loadingChat || saving}
              >
                <div className={styles.inputContainer}>
                  <Input
                    name="name"
                    label={t('chat:room-name')}
                    type="text"
                    autoComplete="off"
                    variant="darkest"
                    noPadding
                    onChange={(event) =>
                      setChatroomName(event.target.value.trim())
                    }
                  />
                </div>
                <button type="submit" className={styles.saveButton}>
                  {t('chat:save-room-name')}
                </button>
              </fieldset>
            </Form>
          </Formik>
        )}
        {showChatroomSettings === 'edit' && (
          <div
            className={`${styles.participantsList} ${
              currentChatroom?.owner?._id === session?.user?._id
                ? styles['participantsList--paddingTop']
                : ''
            }`}
          >
            <h4 className={styles.participantsLabel}>
              {`${t('chat:participants-in-this-room')} (${
                uniqueParticipantsInChatroom?.length
              })`}
            </h4>
            <ParticipantsList
              inChatroom
              isOwnChatroom={currentChatroom?.owner?._id === session?.user?._id}
            />
          </div>
        )}
        {showChatroomSettings !== 'create' && (
          <button
            type="button"
            className={`button--darkest button--mini ${styles.deleteButton}`}
            onClick={() => {
              currentChatroom?.owner?._id === session?.user?._id
                ? handleDelete()
                : handleLeave();
            }}
            disabled={loadingChat || saving}
          >
            {currentChatroom?.owner?._id === session?.user?._id
              ? t('chat:delete-room')
              : t('chat:leave-room')}
          </button>
        )}
      </div>
    </FocusTrap>
  ) : (
    <></>
  );
};
