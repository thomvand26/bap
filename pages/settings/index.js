import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useDatabase, useModal } from '@/context';
import { Input, ProtectedRoute } from '@/components';
import { LANDING } from '@/routes';

import styles from './SettingsPage.module.scss';

const validationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required('Username is required.'),
  });

export default function SettingsPage() {
  const [session] = useSession();
  const { updateUser, deleteAccount } = useDatabase();
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
    // Delete account
    await deleteAccount(router.locale);

    // Close modal
    setModalData(null);

    // Redirect
    router.push(LANDING);
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
  };

  return (
    <div className={`page`}>
      <ProtectedRoute />
      <h1 className="page__title">Settings</h1>
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
