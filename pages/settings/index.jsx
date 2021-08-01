import React, { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useDatabase, useModal } from '@/context';
import { Input } from '@/components';
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
  const { t } = useTranslation(['auth', 'common']);

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
      heading: t('auth:delete-account-warning-title'),
      actions: [
        {
          type: 'danger',
          text: t('auth:delete-account-warning-confirm'),
          onClick: confirmDelete,
        },
        {
          text: t('auth:delete-account-warning-cancel'),
          onClick: () => setModalData(null),
        },
      ],
    });
  };

  return (
    <div className={`page`}>
      <h1 className="page__title">{t('auth:settings')}</h1>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={true}
        initialValues={{
          username: session?.user?.username || '',
        }}
        onSubmit={handleSubmit}
      >
        <Form className={styles.form}>
          <Input
            type="text"
            name="username"
            label={t('auth:username')}
            defaultWidth
          />

          <button
            type="submit"
            className={styles.saveButton}
            disabled={updating}
          >
            {t('common:save')}
          </button>

          <button
            type="button"
            className={`button--text button--danger ${styles.deleteButton}`}
            onClick={handleDelete}
          >
            {t('auth:delete-account')}
          </button>
        </Form>
      </Formik>
    </div>
  );
}

SettingsPage.isProtected = true;

export async function getStaticProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'auth',
        'navigation',
        'common',
        'cookies',
      ])),
    },
  };
}
