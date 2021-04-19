import { Input } from '@/components';
import { LOGIN } from '@/routes';
import { Form, Formik } from 'formik';
import { csrfToken, getSession, signIn } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import * as Yup from 'yup';

import styles from './auth.module.scss';

const validationSchema = (onValid) =>
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
      <h1 className="page__title">Register</h1>
      <Formik
        validationSchema={() => validationSchema(() => router.push('/'))}
        initialValues={{ email: '', username: '', password: '' }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <Form
          onChange={(event) =>
            event?.target?.id === 'videoId' &&
            setVideoURLInput(event.target?.value?.trim?.())
          }
          className="form"
        >
          <Input
            name="email"
            label="Email"
            type="email"
            // autoComplete="off"
          />
          <Input
            name="username"
            label="Username"
            type="username"
            // autoComplete="off"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            // autoComplete="off"
          />
          <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
          <button type="submit">Create account</button>
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
