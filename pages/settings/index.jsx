import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { useDatabase, useModal } from '@/context';
import { Input } from '@/components';
import { LANDING } from '@/routes';

import styles from './SettingsPage.module.scss';

const validationSchema = ({
  updating,
  setUpdating,
  router,
  updateUser,
  usernameRequired,
  usernameExists,
}) =>
  Yup.object()
    .shape({
      username: Yup.string().required(usernameRequired),
    })
    .test({
      name: 'availability-check',
      test: async (values, testContext) => {
        if (updating) return;
        setUpdating(true);
        const hasUndefined = !!Object.values(values).filter(
          (value) => value === undefined
        ).length;

        if (hasUndefined) {
          setUpdating(false);
          return;
        }

        const response = await updateUser(values);

        if (!response?.error) {
          router.reload(window.location.pathname);
          setUpdating(false);
          return;
        }

        const responseObject =
          response.error === 'username_exists'
            ? {
                message: usernameExists,
                field: 'username',
              }
            : {};

        setUpdating(false);

        return testContext.createError({
          message: responseObject.message,
          path: responseObject.field,
        });
      },
    });

export default function SettingsPage() {
  const [session] = useSession();
  const { updateUser, deleteAccount } = useDatabase();
  const { setModalData } = useModal();
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);

  const [updating, setUpdating] = useState();

  const confirmDelete = async () => {
    // Delete account
    deleteAccount(router.locale);

    // Logout
    signOut();

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
        validationSchema={() =>
          validationSchema({
            updating,
            setUpdating,
            router,
            updateUser,
            usernameRequired: t('auth:error-username-required'),
            usernameExists: t('auth:error-username-exists'),
          })
        }
        enableReinitialize={true}
        initialValues={{
          username: session?.user?.username || '',
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form className={styles.form}>
          <fieldset className={styles.fieldset} disabled={updating}>
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
          </fieldset>
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
