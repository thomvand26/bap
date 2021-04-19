import { Input } from '@/components';
import { Form, Formik } from 'formik';
import {
  csrfToken,
  getSession,
  providers,
  signIn,
  useSession,
} from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { REGISTER } from '@/routes';

import styles from './auth.module.scss';

const validationSchema = (onValid) =>
  Yup.object()
    .shape({
      email: Yup.string().required('Email is required.'),
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

        console.log(response);

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

  useEffect(() => {
    if (session) router.push('/');
  }, [session]);

  return (
    <div className="page">
      <h1 className="page__title">Login</h1>
      <Formik
        validationSchema={() => validationSchema(() => router.push('/'))}
        initialValues={{ email: '', password: '' }}
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
            name="password"
            label="Password"
            type="password"
            // autoComplete="off"
          />
          <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
          <button type="submit">Login</button>
          <span className={styles.authSwitch}>
            Don't have an account yet?
            <Link href={REGISTER}>
              <a className="button button--text">Register</a>
            </Link>
          </span>
        </Form>
      </Formik>
    </div>
  );
}

LoginPage.getInitialProps = async (context) => {
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
    providers: await providers(context),
    csrfToken: await csrfToken(context),
  };
};
