import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FiSettings } from 'react-icons/fi';

import { useShow } from '@/context';
import { Input } from '@/components';

import styles from './Chatbox.module.scss';

const validationSchema = Yup.object().shape({
  message: Yup.string().trim(),
});

export const Chatbox = ({ inDashboard }) => {
  const { sendChat, loadingChat } = useShow();

  const handleSubmit = (values, actions) => {
    if (loadingChat) return;

    if (values?.message?.length) {
      sendChat(values.message);
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
        }`}
      >
        <div className={styles.input}>
          <Input
            name="message"
            type="text"
            autoComplete="off"
            variant={inDashboard ? 'light' : 'dark'}
            noPadding
          />
        </div>
        <div className={styles.actions}>
          {!inDashboard && (
            <div className={styles.actions__left}>
              <button
                type="button"
                className={`button--text ${styles.requestButton}`}
              >
                Request a song
              </button>
              <button
                type="button"
                className={`button--icon button--hover-light ${styles.settingsButton}`}
              >
                <FiSettings size="1.4rem" />
              </button>
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
