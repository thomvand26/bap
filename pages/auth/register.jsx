import React from 'react';
import { csrfToken, getSession, signIn } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Input } from '@/components';
import { Layouts } from '@/layouts';
import { LOGIN } from '@/routes';

import styles from './AuthPage.module.scss';

const validationSchema = (locale, onValid) =>
  Yup.object()
    .shape({
      email: Yup.string().required('Email is required.'),
      username: Yup.string().required('Username is required.'),
      password: Yup.string().required('Password is required.'),
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

export default function RegisterPage({ csrfToken }) {
  const router = useRouter();

  return (
    <div className="page">
      <h1 className="page__title">Welcome to <span className={styles.pageTitleRoomStage}>RoomStage</span>!</h1>
      <h1 className={styles.formTitle}>Register</h1>
      <Formik
        validationSchema={() => validationSchema(router.locale, () => router.push('/'))}
        initialValues={{ email: '', username: '', password: '' }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form className={styles.form}>
          <Input
            name="email"
            label="Email"
            type="email"
            // autoComplete="off"
            defaultWidth
          />
          <Input
            name="username"
            label="Username"
            type="username"
            // autoComplete="off"
            defaultWidth
          />
          <Input
            name="password"
            label="Password"
            type="password"
            // autoComplete="off"
            defaultWidth
            noPaddingBottom
          />
          <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
          <button type="submit" className={styles.submitButton}>Create account</button>
          <span className={styles.authSwitch}>
            Already have an account?
            <Link href={LOGIN}>
              <a className="button button--text">Login</a>
            </Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
}

RegisterPage.layout = Layouts.default;

RegisterPage.getInitialProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  if (res && session?.accessToken) {
    res.WriteHead(302, {
      Location: '/',
    });
    res.end();
    return;
  }

  return {
    session: undefined,
    csrfToken: await csrfToken(context),
  };
};
