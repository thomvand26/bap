import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

import { DashboardPanel } from './DashboardPanel';
import { Input, LoadingSpinner } from '@/components';
import { useShow } from '@/context';
import { ARTIST_DASHBOARD, EDIT_SHOW } from '@/routes';

import styles from './DashboardPanel.module.scss';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  startDate: Yup.string().required('Required'),
  endDate: Yup.string().required('Required'),
  public: Yup.boolean(),
  streamURL: Yup.string(),
  maxSongRequestsPerUser: Yup.number(),
});

export const GeneralSettingsPannel = ({ isNewShow, ...props }) => {
  const { currentShow, setCurrentShow, saveShow, deleteShow, loadingShow } =
    useShow();
  const router = useRouter();
  const { t } = useTranslation(['artist-dashboard', 'common']);

  const [saving, setSaving] = useState(false);
  const [enableReinitialize, setEnableReinitialize] = useState(true);

  useEffect(() => {
    if (isNewShow || (!isNewShow && currentShow?._id)) {
      setEnableReinitialize(false);
    } else if (!isNewShow && !currentShow?._id) {
      setEnableReinitialize(true);
    }
  }, [currentShow, isNewShow]);

  const handleSubmit = async (values) => {
    if (saving) return;
    setSaving(true);
    const savedShow = await saveShow({ ...values, _id: currentShow?._id });
    setSaving(false);
    if (currentShow?._id) return;
    if (!currentShow?._id && savedShow?._id) {
      setCurrentShow(savedShow);

      router.push({
        pathname: EDIT_SHOW,
        query: { showId: savedShow._id },
      });
    }
  };

  const handleDelete = async () => {
    if (!currentShow?._id) {
      console.log('no show, cannot delete null');
      return;
    }

    setSaving(true);
    await deleteShow(currentShow);
    setSaving(false);

    router.push(ARTIST_DASHBOARD);
  };

  return (
    <DashboardPanel name={t('artist-dashboard:general-settings')} {...props}>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={enableReinitialize}
        initialValues={{
          title: currentShow?.title || '',
          startDate: currentShow?.startDate || moment(),
          endDate: currentShow?.endDate || moment().add(2, 'h'),
          public: currentShow?.public,
          streamURL: currentShow?.streamURL || '',
          maxSongRequestsPerUser: currentShow?.maxSongRequestsPerUser || 1,
        }}
        onSubmit={handleSubmit}
      >
        <Form
          className={styles.form}
          onChange={(event) => {
            event?.target?.id === 'streamURL' &&
              setCurrentShow((prev) => ({
                ...prev,
                streamURL: event.target?.value?.trim?.(),
              }));
          }}
        >
          <fieldset
            className={`${styles.fieldset} ${styles[`fieldset--2col`]}`}
            disabled={saving}
          >
            <h3 className={styles.panel__subtitle}>
              {t('artist-dashboard:general')}
            </h3>
            <div className={styles.inputContainer}>
              <div>
                <Input
                  name="title"
                  label={t('artist-dashboard:show-title')}
                  type="text"
                  autoComplete="off"
                  variant="light"
                />
                <Input
                  name="startDate"
                  label={t('artist-dashboard:start-date')}
                  type="datetime"
                  autoComplete="off"
                  variant="light"
                  withTime
                />
                <Input
                  name="endDate"
                  label={t('artist-dashboard:end-date')}
                  type="datetime"
                  autoComplete="off"
                  variant="light"
                  withTime
                />
              </div>
              <div>
                <Input
                  name="maxSongRequestsPerUser"
                  label={t('artist-dashboard:max-song-requests')}
                  type="slider"
                  variant="light"
                  min={0}
                  max={10}
                  step={1}
                  info={t('artist-dashboard:max-song-requests-info')}
                />
                <Input
                  name="public"
                  label={t('artist-dashboard:public')}
                  type="toggle"
                  variant="light"
                  info={t('artist-dashboard:public-info')}
                />
              </div>
            </div>
            <h3 className={styles.panel__subtitle}>
              {t('artist-dashboard:stream')}
            </h3>
            <div className={styles.inputContainer}>
              <Input
                name="streamURL"
                label={t('artist-dashboard:stream-url')}
                type="text"
                autoComplete="off"
                variant="light"
              />
            </div>
            <div className={styles.panel__buttonGroup}>
              {loadingShow === false && currentShow?._id ? (
                <>
                  <button type="submit">{t('common:save')}</button>
                  <button
                    className="button button--ghost button--danger"
                    type="button"
                    onClick={handleDelete}
                  >
                    {t('artist-dashboard:delete-show')}
                  </button>
                </>
              ) : (
                <button type="submit">
                  {t('artist-dashboard:create-show')}
                </button>
              )}
            </div>
          </fieldset>
        </Form>
      </Formik>

      {loadingShow && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      )}
    </DashboardPanel>
  );
};
