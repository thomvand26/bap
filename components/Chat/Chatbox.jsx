import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';

import { useShow } from '@/context';
import { Input } from '@/components';

import styles from './Chatbox.module.scss';

const validationSchema = Yup.object().shape({
  message: Yup.string().trim(),
});

export const Chatbox = ({
  inDashboard,
  showSongRequestChatbox,
  setShowSongRequestChatbox,
  forSongRequest,
  setReachedSongRequestLimit,
}) => {
  const [session] = useSession();
  const {
    sendChat,
    loadingChat,
    createSongRequest,
    currentShow,
    currentSongRequests,
  } = useShow();

  const [allowSongRequests, setAllowSongRequests] = useState(true);
  const [reachedLimit, setReachedLimit] = useState(false);

  useEffect(() => {
    setAllowSongRequests(currentShow?.maxSongRequestsPerUser > 0);
  }, [currentShow?.maxSongRequestsPerUser]);

  useEffect(() => {
    const hasReachedLimit =
      currentSongRequests?.filter(
        (songRequest) => songRequest?.owner?._id === session?.user?._id
      ).length >= currentShow?.maxSongRequestsPerUser &&
      (currentShow?.owner?._id || currentShow?.owner) !== session?.user?._id;
    setReachedLimit(hasReachedLimit);
    setReachedSongRequestLimit?.(hasReachedLimit);
  }, [currentSongRequests, currentShow?.maxSongRequestsPerUser]);

  const handleSubmit = (values, actions) => {
    if (loadingChat) return;

    if (values?.message?.length) {
      if (showSongRequestChatbox || forSongRequest) {
        createSongRequest({ song: values.message, inDashboard });
        document.activeElement.blur();
      } else {
        sendChat(values.message);
      }
    }

    actions.resetForm();
  };

  return (
    <Formik
      validationSchema={validationSchema}
      enableReinitialize={true}
      initialValues={{
        message: '',
      }}
      onSubmit={handleSubmit}
    >
      <Form
        className={`${styles.form} ${
          inDashboard ? styles['form--inDashboard'] : ''
        } ${forSongRequest ? styles['form--songRequest'] : ''}`}
      >
        {showSongRequestChatbox && allowSongRequests && (
          <div className={styles.songRequestHeading}>
            <h2 className={`h3`}>Request a song!</h2>
            <button
              type="button"
              className={`button--icon button--lightest button--noMinHeight ${styles.songRequestCloseButton}`}
              onClick={() => setShowSongRequestChatbox?.(false)}
            >
              <FaTimes />
            </button>
          </div>
        )}
        <div className={`${styles.input}`}>
          <Input
            name='message'
            id={forSongRequest ? 'songRequest' : 'message'}
            type="text"
            autoComplete="off"
            placeholder={
              !inDashboard
                ? showSongRequestChatbox
                  ? 'Request a song!'
                  : 'Say something!'
                : ''
            }
            variant={
              inDashboard
                ? 'light'
                : showSongRequestChatbox && allowSongRequests
                ? 'darkest'
                : 'dark'
            }
            label={forSongRequest ? 'Send your own request' : ''}
            info={
              forSongRequest && !allowSongRequests
                ? "Only you can send song requests. ('Maximum song requests per user' is set to 0)"
                : ''
            }
            noPadding
          />
        </div>
        <div className={styles.actions}>
          {!inDashboard && (
            <div className={styles.actions__left}>
              {allowSongRequests && (
                <button
                  type="button"
                  className={`button--text ${styles.requestButton}`}
                  onClick={() => setShowSongRequestChatbox?.((prev) => !prev)}
                  disabled={reachedLimit}
                >
                  {showSongRequestChatbox
                    ? 'Go back to chat'
                    : reachedLimit
                    ? "You can't request more songs"
                    : 'Request a song'}
                </button>
              )}
              {/* <button
                type="button"
                className={`button--icon button--hover-light ${styles.settingsButton}`}
              >
                <FiSettings size="1.4rem" />
              </button> */}
            </div>
          )}
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </div>
      </Form>
    </Formik>
  );
};
