import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Form, Formik } from 'formik';

import { useCookies } from '@/context';
import { Input } from '@/components';
import { COOKIES_PRIVACY } from '@/routes';

import styles from './CookieForm.module.scss';
import Link from 'next/link';

export const CookieForm = ({ className, withMoreInfoLink }) => {
  const { t } = useTranslation(['cookies']);
  const { cookieValues, setCookieValues } = useCookies();
  const [showConfirmation, setShowConfirmation] = useState();

  useEffect(() => {
    if (!showConfirmation) return;

    const confirmationTimer = setTimeout(
      () => setShowConfirmation(false),
      500
    );

    return () => {
      clearTimeout(confirmationTimer);
    };
  }, [showConfirmation]);

  const handleSubmit = (data) => {
    setCookieValues(data);
    setShowConfirmation(true);
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
        <fieldset className={styles.fieldset} disabled={showConfirmation}>
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
