import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Form, Formik } from 'formik';

import { Input } from '@/components';

import styles from './CookieForm.module.scss';

export const CookieForm = ({ className }) => {
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
      <Form className={`${className || ''}`}>
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
          <button type="submit" className={styles.submitButton}>
            {t('cookies:form-save')}
          </button>
        </fieldset>
      </Form>
    </Formik>
  );
};
