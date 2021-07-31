import React, { useEffect } from 'react';
import { csrfToken, getSession, signIn, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Layouts } from '@/layouts';
import { Input } from '@/components';
import { LANDING, REGISTER } from '@/routes';

import styles from './AuthPage.module.scss';

const validationSchema = ({ emailRequired, passRequired }, locale, onValid) =>
  Yup.object()
    .shape({
      email: Yup.string().required(emailRequired),
      password: Yup.string().required(passRequired),
    })
    .test({
      name: 'auth-check',
      test: async (values, testContext) => {
        const hasUndefined = !!Object.values(values).filter(
          (value) => value === undefined
        ).length;

        if (hasUndefined) return;

        const response = await signIn('email-password', {
          redirect: false,
          locale,
          ...values,
        });

        if (!response?.error && onValid instanceof Function) {
          onValid();
          return;
        }

        const responseObject = Object.fromEntries(
          new URLSearchParams(response.error)
        );

        return testContext.createError({
          message: responseObject.message,
          path: responseObject.field,
        });
      },
    });

export default function LoginPage({ providers, csrfToken }) {
  const router = useRouter();
  const [session, loading] = useSession();
  const { t } = useTranslation(['login-page', 'auth']);

  useEffect(() => {
    if (session?.user?._id) router.push(LANDING);
  }, [session]);

  return (
    <div className="page">
      <h1 className="page__title">{t('login-page:page-title')}</h1>
      <h1 className={styles.formTitle}>Login</h1>
      <Formik
        validationSchema={() =>
          validationSchema(
            {
              emailRequired: t('auth:error-email-required'),
              passRequired: t('auth:error-password-required'),
            },
            () => router.push(LANDING)
          )
        }
        initialValues={{ email: '', password: '' }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form className={styles.form}>
          <Input
            name="email"
            label={t('auth:email')}
            type="email"
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
          <button type="submit" className={styles.submitButton}>
            {t('auth:login')}
          </button>
          <span className={styles.authSwitch}>
            {t('login-page:no-account-yet')}
            <Link href={REGISTER}>
              <a className="button button--text">{t('auth:register')}</a>
            </Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
}

LoginPage.layout = Layouts.default;

export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        'login-page',
        'auth',
        'navigation',
      ])),
      session: await getSession(context),
      csrfToken: await csrfToken(context),
    },
  };
}
