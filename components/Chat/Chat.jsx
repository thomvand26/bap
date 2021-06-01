import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { MdExitToApp } from 'react-icons/md';

import { useShow } from '@/context';
import { Input } from '@/components';
import { Chatroom } from './Chatroom';

import styles from './Chat.module.scss';
import { LANDING } from '@/routes';

const validationSchema = Yup.object().shape({
  message: Yup.string().trim(),
});

export const Chat = () => {
  const { sendChat, currentShow } = useShow();

  const handleSubmit = (values, actions) => {
    if (values?.message?.length) {
      sendChat(values.message);
    }

    actions.resetForm();
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.topSection}>
        {currentShow?.title && (
          <h2 className={styles.showTitle}>{currentShow.title}</h2>
        )}
        <Link href={LANDING}>
          <MdExitToApp
            className={`button button--icon button--danger button--hover-light ${styles.actionButton}`}
            size="1.8rem"
          />
        </Link>
      </div>
      <div className={styles.requests}>Song requests</div>
      <div className={styles.chats}>
        <Chatroom />
      </div>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={true}
        initialValues={{
          message: '',
        }}
        onSubmit={handleSubmit}
      >
        <Form className={styles.bottom}>
          <Input name="message" type="text" autoComplete="off" />
          <button type="submit">Send</button>
        </Form>
      </Formik>
    </div>
  );
};
