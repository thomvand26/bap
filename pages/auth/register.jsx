import React, { useEffect, useState } from 'react';
import { csrfToken, getSession, signIn, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { appConfig } from '@/config';
import { Input } from '@/components';
import { Layouts } from '@/layouts';
import { COOKIES_PRIVACY, LANDING, LOGIN } from '@/routes';

import styles from './AuthPage.module.scss';

const validationSchema = (
  { emailRequired, usernameRequired, passRequired },
  locale,
  submitting,
  setSubmitting,
  onValid
) =>
  Yup.object()
    .shape({
      email: Yup.string().required(emailRequired),
      username: Yup.string().required(usernameRequired),
      password: Yup.string().required(passRequired),
    })
    .test({
      name: 'auth-check',
      test: async (values, testContext) => {
        if (submitting) return;
        setSubmitting?.(true);
        const hasUndefined = !!Object.values(values).filter(
          (value) => value === undefined
        ).length;

        if (hasUndefined) {
          setSubmitting?.(false);
          return;
        }

        const response = await signIn('email-password', {
          redirect: false,
          locale,
          ...values,
        });

        if (!response?.error && onValid instanceof Function) {
          setSubmitting?.(false);
          onValid();
          return;
        }

        const responseObject = Object.fromEntries(
          new URLSearchParams(response.error)
        );

        setSubmitting?.(false);

        return testContext.createError({
          message: responseObject.message,
          path: responseObject.field,
        });
      },
    });

export default function RegisterPage({ csrfToken }) {
  const router = useRouter();
  const [session, loading] = useSession();
  const { t } = useTranslation(['register-page', 'auth']);
  const [submitting, setSubmitting] = useState();

  useEffect(() => {
    if (session?.user?._id) router.push(LANDING);
  }, [session]);

  return (
    <div className="page">
      <Head>
        <title>{`${appConfig.appName} - ${t('register-page:page-title')} ${
          appConfig.appName
        }`}</title>
      </Head>
      <h1 className="page__title">
        {t('register-page:page-title')}
        <span className={styles.pageTitleRoomStage}>{appConfig.appName}</span>!
      </h1>
      <h1 className={styles.formTitle}>{t('auth:register')}</h1>
      <Formik
        validationSchema={() =>
          validationSchema(
            {
              emailRequired: t('auth:error-email-required'),
              usernameRequired: t('auth:error-username-required'),
              passRequired: t('auth:error-password-required'),
            },
            router.locale,
            submitting,
            setSubmitting,
            () => router.push('/')
          )
        }
        initialValues={{ email: '', username: '', password: '' }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form className={styles.form}>
          <fieldset className={styles.fieldset} disabled={submitting}>
            <Input
              name="email"
              label={t('auth:email')}
              type="email"
              defaultWidth
            />
            <Input
              name="username"
              label={t('auth:username')}
              type="username"
              defaultWidth
            />
            <Input
              name="password"
              label={t('auth:password')}
              type="password"
              defaultWidth
              noPaddingBottom
            />
            <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
            <div className={styles.storageInfo}>
              {t('auth:allow-storage')}{' '}
              <Link href={COOKIES_PRIVACY}>{t('auth:more-info')}</Link>
            </div>
            <button type="submit" className={styles.submitButton}>
              {t('auth:create-account')}
            </button>
            <span className={styles.authSwitch}>
              {t('register-page:already-account')}
              <Link href={LOGIN}>
                <a className="button--text">{t('auth:login')}</a>
              </Link>
            </span>
          </fieldset>
        </Form>
      </Formik>
    </div>
  );
}

RegisterPage.layout = Layouts.default;

export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'register-page',
        'auth',
        'navigation',
        'cookies',
        'common',
      ])),
      session: await getSession(context),
      csrfToken: await csrfToken(context),
    },
  };
}
