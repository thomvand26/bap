import React from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { FaTrash } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

import {
  getHighestPollOption,
  getTotalPollVotes,
  upsertDocumentInArrayState,
} from '@/utils';
import { useShow, useModal } from '@/context';
import { Input, AddButton } from '@/components';

import styles from './PollSettingsForm.module.scss';

export const PollSettingsForm = ({ saving, setSaving }) => {
  const { currentPoll, setCurrentPoll, setCurrentPolls, createPoll, updatePoll, deletePoll } =
    useShow();
  const { t } = useTranslation(['artist-dashboard', 'common']);
  const { setModalData } = useModal();

  const handleSubmit = async (data) => {
    setSaving(true);
    const response = await (currentPoll?._id
      ? updatePoll({ _id: currentPoll._id, ...data })
      : createPoll(data));
    if (!response?._id) {
      setSaving(false);
      return;
    }
    if (data.visible) {
      setCurrentPolls((prev) =>
        prev.map((poll) => ({ ...poll, visible: false }))
      );
    }
    upsertDocumentInArrayState({
      setFunction: setCurrentPolls,
      document: response,
    });
    setCurrentPoll(response);
    setSaving(false);
  };

  const confirmDelete = async () => {
    setModalData(null);
    setSaving(true);
    const response = await deletePoll(currentPoll?._id);
    if (!response?._id) return;
    setCurrentPoll(null);
    setCurrentPolls((prev) =>
      prev.filter((poll) => poll._id !== response?._id)
    );
    setSaving(false);
  };

  const handleDelete = async () => {
    // Show warning modal
    setModalData({
      heading: t('artist-dashboard:delete-poll-warning-title'),
      actions: [
        {
          type: 'danger',
          text: t('artist-dashboard:delete-poll-warning-confirm'),
          onClick: confirmDelete,
        },
        {
          text: t('artist-dashboard:delete-poll-warning-cancel'),
          onClick: () => setModalData(null),
        },
      ],
    });
  };

  return (
    <div className={styles.pollSettings}>
      {currentPoll ? (
        <Formik
          enableReinitialize={true}
          initialValues={{
            pollTitle: currentPoll.pollTitle || '',
            options: currentPoll.options || [],
            allowMultipleChoices: !!currentPoll.allowMultipleChoices,
            visible: !!currentPoll.visible,
            showResults: !!currentPoll.showResults,
          }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, submitForm }) => (
            <Form className={styles.pollSettings__form}>
              <fieldset disabled={saving}>
                <Input
                  name="pollTitle"
                  label={t('artist-dashboard:title')}
                  type="text"
                  variant="light"
                  autoComplete="off"
                />
                <label className={styles.label}>
                  {t('artist-dashboard:options')}
                </label>
                <FieldArray>
                  <ol className={styles.optionList}>
                    {!!currentPoll?.options?.length &&
                      [...currentPoll.options]
                        .sort(
                          (optionA, optionB) =>
                            optionA.position - optionB.position
                        )
                        .map((option, i) => (
                          <li key={i} className={styles.optionList__item}>
                            <div className={styles.optionList__bullet}>
                              {i + 1}.
                            </div>
                            <Input
                              name={`options.${i}.optionName`}
                              type="text"
                              variant="light"
                              autoComplete="off"
                              containerClassName={styles.optionList__input}
                              noPadding
                            />
                            <div
                              className={`${styles.optionList__percentage} ${
                                getTotalPollVotes(currentPoll) > 0 &&
                                getHighestPollOption(currentPoll).voters
                                  .length === option.voters.length
                                  ? styles['optionList__percentage--highest']
                                  : ''
                              }`}
                            >
                              {Math.round(
                                (option.voters.length /
                                  getTotalPollVotes(currentPoll) || 0) * 100
                              )}
                              %
                            </div>
                            <button
                              type="button"
                              className={`button--icon button--danger button--noMinHeight ${styles.optionList__deleteButton}`}
                              onClick={() =>
                                setCurrentPoll((prev) => {
                                  const newOptions = [...prev.options];
                                  newOptions.splice(i, 1);
                                  return {
                                    ...prev,
                                    options: newOptions,
                                  };
                                })
                              }
                              disabled={currentPoll.options.length < 3}
                            >
                              <FaTrash />
                            </button>
                          </li>
                        ))}
                    <li className={styles.addButton}>
                      <AddButton
                        onClick={() =>
                          setCurrentPoll((prev) => ({
                            ...prev,
                            options: [
                              ...prev.options,
                              {
                                voters: [],
                                optionName: `Option ${prev.options.length + 1}`,
                                position:
                                  prev.options[prev.options.length - 1]
                                    ?.position + 1,
                              },
                            ],
                          }))
                        }
                        disabled={currentPoll?.options?.length > 4}
                      />
                    </li>
                  </ol>
                </FieldArray>
                <label className={styles.label}>
                  {t('artist-dashboard:settings')}
                </label>
                <Input
                  name="allowMultipleChoices"
                  label={t('artist-dashboard:allow-multiple-choices')}
                  type="toggle"
                  variant="light"
                />
                <Input
                  name="showResults"
                  label={t('artist-dashboard:show-results')}
                  type="toggle"
                  variant="light"
                  info={t('artist-dashboard:show-results-info')}
                />
                <div className={styles.buttonGroup}>
                  <button type="submit" className="button--mini focus-inset">
                    {t('common:save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue('visible', !currentPoll.visible);
                      submitForm();
                    }}
                    className="button--mini focus-inset"
                  >
                    {currentPoll.visible
                      ? t('artist-dashboard:hide-poll')
                      : t('artist-dashboard:start-poll')}
                  </button>
                  <button
                    type="button"
                    className="button--ghost button--danger button--mini focus-inset"
                    onClick={handleDelete}
                    disabled={!currentPoll?._id}
                  >
                    {t('common:delete')}
                  </button>
                </div>
              </fieldset>
            </Form>
          )}
        </Formik>
      ) : (
        <div className={`centeredPlaceholder ${styles.placeholder}`}>
          {t('artist-dashboard:select-or-create-poll')}
        </div>
      )}
    </div>
  );
};
