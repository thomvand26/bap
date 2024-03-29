import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FaTimes } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation(['artist-dashboard', 'chat']);

  const [allowSongRequests, setAllowSongRequests] = useState(true);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [submitting, setSubmitting] = useState();

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

  const handleSubmit = async (values, actions) => {
    if (loadingChat) return;
    if (submitting) return;
    setSubmitting(true);

    if (values?.message?.length) {
      if (showSongRequestChatbox || forSongRequest) {
        await createSongRequest({ song: values.message, inDashboard });
      } else {
        sendChat(values.message);
      }
    }

    setSubmitting(false);

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
      <Form>
        <fieldset
          className={`${styles.fieldset} ${
            inDashboard ? styles['fieldset--inDashboard'] : ''
          } ${forSongRequest ? styles['fieldset--songRequest'] : ''}`}
          disabled={loadingChat || submitting}
        >
          {showSongRequestChatbox && allowSongRequests && (
            <div className={styles.songRequestHeading}>
              <h2 className={`h3`}>{t('chat:request-a-song-title')}</h2>
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
              name="message"
              id={forSongRequest ? 'songRequest' : 'message'}
              type="text"
              autoComplete="off"
              placeholder={
                !inDashboard
                  ? showSongRequestChatbox
                    ? t('chat:song-request-placeholder')
                    : t('chat:chat-placeholder')
                  : ''
              }
              variant={
                inDashboard
                  ? 'light'
                  : showSongRequestChatbox && allowSongRequests
                  ? 'darkest'
                  : 'dark'
              }
              label={
                forSongRequest
                  ? t('artist-dashboard:send-own-song-requests')
                  : ''
              }
              info={
                forSongRequest && !allowSongRequests
                  ? t('artist-dashboard:send-own-song-requests-info')
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
                      ? t('chat:go-back-to-chat')
                      : reachedLimit
                      ? t('chat:request-a-song-reached-limit')
                      : t('chat:request-a-song')}
                  </button>
                )}
              </div>
            )}
            <button type="submit" className={styles.sendButton}>
              {t('chat:send')}
            </button>
          </div>
        </fieldset>
      </Form>
    </Formik>
  );
};
