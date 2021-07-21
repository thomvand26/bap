import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

import { DashboardPanel } from './DashboardPanel';
import { Input, LoadingSpinner } from '@/components';
import { useShow } from '@/context';
import { ARTIST_DASHBOARD, EDIT_SHOW } from '@/routes';

import styles from './dashboardPanel.module.scss';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  startDate: Yup.string().required('Required'),
  endDate: Yup.string().required('Required'),
  visible: Yup.boolean(),
  streamURL: Yup.string(),
  maxSongRequestsPerUser: Yup.number(),
});

export const GeneralSettingsPannel = ({ isNewShow, ...props }) => {
  const { currentShow, setCurrentShow, saveShow, deleteShow, loadingShow } =
    useShow();
  const router = useRouter();

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

    await deleteShow(currentShow);

    router.push(ARTIST_DASHBOARD);
  };

  return (
    <DashboardPanel name="General settings" {...props}>
      {loadingShow ? (
        <LoadingSpinner />
      ) : (
        <Formik
          validationSchema={validationSchema}
          enableReinitialize={enableReinitialize}
          initialValues={{
            title: currentShow?.title || '',
            startDate: currentShow?.startDate || moment(),
            endDate: currentShow?.endDate || moment().add(2, 'h'),
            visible: currentShow?.visible,
            streamURL: currentShow?.streamURL || '',
            maxSongRequestsPerUser: currentShow?.maxSongRequestsPerUser || 1,
          }}
          onSubmit={handleSubmit}
        >
          <Form
            className={`${styles.form} ${styles[`form--2col`]}`}
            onChange={(event) => {
              event?.target?.id === 'streamURL' &&
                setCurrentShow((prev) => ({
                  ...prev,
                  streamURL: event.target?.value?.trim?.(),
                }));
            }}
          >
            <h3 className={styles.panel__subtitle}>General</h3>
            <div className={styles.inputContainer}>
              <div>
                <Input
                  name="title"
                  label="Show title"
                  type="text"
                  autoComplete="off"
                  variant="light"
                />
                <Input
                  name="startDate"
                  label="Start date"
                  type="datetime"
                  autoComplete="off"
                  variant="light"
                  withTime
                />
                <Input
                  name="endDate"
                  label="End date"
                  type="datetime"
                  autoComplete="off"
                  variant="light"
                  withTime
                />
              </div>
              <div>
                <Input
                  name="maxSongRequestsPerUser"
                  label="Maximum song requests per user"
                  type="slider"
                  variant="light"
                  min={0}
                  max={10}
                  step={1}
                  info="How many song requests can the user make? (Song requests will be disabled if this is set to 0.)"
                />
                <Input
                  name="visible"
                  label="Visible"
                  type="toggle"
                  variant="light"
                  info="Should everyone be able to see this show?"
                />
              </div>
            </div>
            <h3 className={styles.panel__subtitle}>Stream</h3>
            <div className={styles.inputContainer}>
              <Input
                name="streamURL"
                label="Stream URL"
                type="text"
                autoComplete="off"
                variant="light"
              />
            </div>
            <div className={styles.panel__buttonGroup}>
              {loadingShow === false && currentShow?._id ? (
                <>
                  <button type="submit" disabled={saving}>
                    Save
                  </button>
                  <button
                    className="button button--ghost button--danger"
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    Delete this show
                  </button>
                </>
              ) : (
                <button type="submit" disabled={saving}>
                  Create show
                </button>
              )}
            </div>
          </Form>
        </Formik>
      )}
    </DashboardPanel>
  );
};
