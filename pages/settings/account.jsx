import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Layouts } from '@/layouts';
import { useDatabase } from '@/context';
import { Input, ProtectedRoute } from '@/components';

import styles from './settings.module.scss';
import { useRouter } from 'next/router';

const validationSchema = () =>
  Yup.object().shape({
    username: Yup.string().required('Username is required.'),
  });

export default function AccountSettingsPage() {
  const [session] = useSession();
  const { updateUser } = useDatabase();
  const router = useRouter();

  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (data) => {
    if (updating) return;
    setUpdating(true);
    await updateUser(data);
    router.reload(window.location.pathname);
    setUpdating(false);
  };

  return (
    <div className={`page ${styles.page}`}>
      <ProtectedRoute />
      <h1 className="pageHeader">Account settings</h1>
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
          >
            Delete account
          </button>
        </Form>
      </Formik>
    </div>
  );
}

AccountSettingsPage.layout = Layouts.settings;
