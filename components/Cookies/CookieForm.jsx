import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Form, Formik } from 'formik';

import { Input } from '@/components';

import styles from './CookieForm.module.scss';
import Link from 'next/link';
import { COOKIES_PRIVACY } from '@/routes';
import { useRouter } from 'next/router';

export const CookieForm = ({ className, withMoreInfoLink }) => {
  const router = useRouter();
  const { t } = useTranslation(['cookies']);
  const [cookieValues, setCookieValues] = useState();

  useEffect(() => {
    const storedCookieValues = JSON.parse(
      sessionStorage.getItem('cookieValues')
    );
    setCookieValues(storedCookieValues);
  }, []);

  const handleSubmit = (data) => {
    sessionStorage.setItem('cookieValues', JSON.stringify(data));
    setCookieValues(data);
    if (withMoreInfoLink) router.reload();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        strictly:
          typeof cookieValues?.strictly === 'undefined'
            ? true
            : cookieValues.strictly,
        youtube:
          typeof cookieValues?.youtube === 'undefined'
            ? false
            : cookieValues.youtube,
      }}
      onSubmit={handleSubmit}
    >
      <Form className={`${className || ''} ${styles.form}`}>
        <fieldset className={styles.fieldset}>
          <Input
            type="toggle"
            name={'strictly'}
            label={t('cookies:strictly-necessary-toggle')}
            disabled={true}
          />
          <Input
            type="toggle"
            name={'youtube'}
            label={t('cookies:youtube-toggle')}
            noPaddingBottom
          />
          {withMoreInfoLink && (
            <Link href={COOKIES_PRIVACY}>
              <a className={styles.moreInfo}>
                {t('cookies:cookie-modal-more-info')}
              </a>
            </Link>
          )}
          <button type="submit" className={styles.submitButton}>
            {t('cookies:form-save')}
          </button>
        </fieldset>
      </Form>
    </Formik>
  );
};
