import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useDatabase, useModal } from '@/context';
import { Input, ProtectedRoute } from '@/components';

import styles from './SettingsPage.module.scss';

const validationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required('Username is required.'),
  });

export default function SettingsPage() {
  const [session] = useSession();
  const { updateUser } = useDatabase();
  const { setModalData } = useModal();
  const router = useRouter();

  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (data) => {
    if (updating) return;
    setUpdating(true);
    await updateUser(data);
    router.reload(window.location.pathname);
    setUpdating(false);
  };

  const confirmDelete = async () => {
    console.log('Confirmed. Account can be deleted now');
  };

  const handleDelete = async () => {
    // Show warning modal
    setModalData({
      heading: 'Are you sure you want to delete your account?',
      actions: [
        { type: 'danger', text: 'Yes, delete it', onClick: confirmDelete },
        { text: 'No, go back', onClick: () => setModalData(null) },
      ],
    });

    // Delete account
    // TODO

    // Redirect
    // TODO
  };

  return (
    <div className={`page ${styles.page}`}>
      <ProtectedRoute />
      <h1 className="pageHeader">Settings</h1>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={true}
        initialValues={{
          username: session?.user?.username || '',
        }}
        onSubmit={handleSubmit}
      >
        <Form className={styles.form}>
          <Input type="text" name="username" label="Username" defaultWidth />

          <button
            type="submit"
            className={styles.saveButton}
            disabled={updating}
          >
            Save
          </button>

          <button
            type="button"
            className={`button--text button--danger ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            Delete account
          </button>
        </Form>
      </Formik>
    </div>
  );
}
