import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useShow } from '@/context';
import { Input } from '@/components';
import { Chatroom } from './Chatroom';

import styles from './Chat.module.scss';

const validationSchema = Yup.object().shape({
  message: Yup.string().trim(),
});

export const Chat = () => {
  const { sendChat } = useShow();

  const handleSubmit = (values, actions) => {
    if (values?.message?.length) {
      sendChat(values.message);
    }

    actions.resetForm();
  };

  return (
    <div className={styles.chatContainer}>
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
          <Input
            name="message"
            type="text"
            autoComplete="off"
          />
          <button type="submit">Send</button>
        </Form>
      </Formik>
    </div>
  );
};
