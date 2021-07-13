import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import moment from 'moment';

import { DashboardPanel } from './DashboardPanel';
import { Input } from '@/components';
import { useShow } from '@/context/ShowContext';

import styles from './dashboardPanel.module.scss';
import { useRouter } from 'next/router';
import { ARTIST_DASHBOARD, EDIT_SHOW } from '@/routes';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  startDate: Yup.string().required('Required'),
  endDate: Yup.string().required('Required'),
});

export const GeneralSettingsPannel = ({
  defaultShow,
  loadingShow,
  ...props
}) => {
  const { setCurrentShow, saveShow, deleteShow } = useShow();
  const router = useRouter();

  useEffect(() => {
    setCurrentShow(defaultShow);
  }, [defaultShow]);

  const handleSubmit = async (values) => {
    const savedShow = await saveShow({ ...values, _id: defaultShow?._id });
    if (defaultShow?._id) return;
    if (!defaultShow?._id && savedShow?._id) {
      router.push({
        pathname: EDIT_SHOW,
        query: { showId: savedShow._id },
      });
    }
  };

  const handleDelete = async () => {
    if (!defaultShow?._id) {
      console.log('no show, cannot delete null');
      return;
    }

    await deleteShow(defaultShow);

    router.push(ARTIST_DASHBOARD);
  };

  return (
    <DashboardPanel name="General settings" {...props}>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize={loadingShow}
        initialValues={{
          title: defaultShow?.title || '',
          startDate: defaultShow?.startDate || moment(),
          endDate: defaultShow?.endDate || moment().add(2, 'h'),
          maxWatchers: defaultShow?.maxWatchers || 200,
          // allowSongRequests: defaultShow?.allowSongRequests,
          visible: defaultShow?.visible,
          streamURL: defaultShow?.streamURL || '',
          maxSongRequestsPerUser: defaultShow?.maxSongRequestsPerUser || 1,
        }}
        onSubmit={handleSubmit}
      >
        <Form
          className={`${styles.form} ${styles[`form--2col`]}`}
          onChange={(event) =>
            event?.target?.id === 'streamURL' &&
            setCurrentShow((prev) => ({
              ...prev,
              streamURL: event.target?.value?.trim?.(),
            }))
          }
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
                name="maxWatchers"
                label="Maximum participants"
                type="slider"
                variant="light"
                min={10}
                max={1000}
                step={10}
              />
              {/* <Input
                name="allowSongRequests"
                label="Allow song request"
                type="toggle"
                variant="light"
              /> */}
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
                info="Should everyone be able to see & get reminders to this show?"
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
            {loadingShow === false && defaultShow?._id ? (
              <>
                <button type="submit">Save</button>
                {/* <button type="button">Start the show!</button> */}
                <button
                  className="button button--ghost button--danger"
                  type="button"
                  onClick={handleDelete}
                >
                  Delete this show
                </button>
              </>
            ) : (
              <button type="submit">Create show</button>
            )}
          </div>
        </Form>
      </Formik>
    </DashboardPanel>
  );
};
