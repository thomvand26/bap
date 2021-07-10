import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';

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
  } = useShow();
  const [session] = useSession();
  const [chatroomName, setChatroomName] = useState('My chatroom');

  useEffect(() => {
    setChatroomName((prev) => currentChatroom?.name || prev);
  }, [currentChatroom]);

  const handleSubmit = async (data) => {
    if (showChatroomSettings === 'create') {
      await createChatroom(data);
      return;
    }
    await updateChatroom(data);
  };

  const handleDelete = () => {
    console.log('handleDelete');
    deleteChatroom({ chatroomId: currentChatroom?._id });
  };

  const handleLeave = () => {
    console.log('handleLeave');
    leaveChatroom(currentChatroom?._id);
  };

  return showChatroomSettings ? (
    <div className={styles?.container}>
      <div className={styles?.top}>
        <h3>{chatroomName}</h3>
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
                ? 'My chatroom'
                : currentChatroom?.name,
          }}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <div className={styles.inputContainer}>
              <Input
                name="name"
                label="Room name"
                type="text"
                autoComplete="off"
                variant="darkest"
                noPadding
                onChange={(event) => setChatroomName(event.target.value.trim())}
              />
            </div>
            <button type="submit" className={styles.saveButton}>
              Save
            </button>
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
            Participants in this room{' '}
            {`(${uniqueParticipantsInChatroom?.length})`}
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
        >
          {currentChatroom?.owner?._id === session?.user?._id
            ? 'Delete this room'
            : 'Leave this room'}
        </button>
      )}
    </div>
  ) : (
    <></>
  );
};
