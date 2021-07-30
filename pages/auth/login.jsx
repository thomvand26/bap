import React, { useEffect } from 'react';
import { csrfToken, signIn, useSession } from 'next-auth/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { Layouts } from '@/layouts';
import { Input } from '@/components';
import { LANDING, REGISTER } from '@/routes';

import styles from './AuthPage.module.scss';

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
    if (session?.user?._id) router.push(LANDING);
  }, [session]);

  return (
    <div className="page">
      <h1 className="page__title">Welcome back!</h1>
      <h1 className={styles.formTitle}>Login</h1>
      <Formik
        validationSchema={() => validationSchema(() => router.push(LANDING))}
        initialValues={{ email: '', password: '' }}
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
            name="password"
            label="Password"
            type="password"
            // autoComplete="off"
            defaultWidth
            noPaddingBottom
          />
          <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
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

LoginPage.layout = Layouts.default;

LoginPage.getInitialProps = async (context) => {
  // const { req, res } = context;
  // const session = await getSession({ req });
  // if (res && session?.accessToken) {
  //   res.WriteHead(302, {
  //     Location: '/',
  //   });
  //   res.end();
  //   return;
  // }
  // res.end();
  console.time('csrf');
  const csrf = await csrfToken(context);
  console.timeEnd('csrf');

  return {
    // session: undefined,
    // providers: await providers(context),
    csrfToken: csrf,
  };
};
