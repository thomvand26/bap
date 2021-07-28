import React from 'react';
import { FieldArray, Form, Formik } from 'formik';
import { FaTrash } from 'react-icons/fa';

import {
  getHighestPollOption,
  getTotalPollVotes,
  upsertDocumentInArrayState,
} from '@/utils';
import { useShow } from '@/context';
import { Input, AddButton } from '@/components';

import styles from './PollSettingsForm.module.scss';

export const PollSettingsForm = ({ saving, setSaving }) => {
  const { currentPoll, setCurrentPoll, createPoll, updatePoll, deletePoll } =
    useShow();

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

  const handleDelete = async () => {
    setSaving(true);
    const response = await deletePoll(currentPoll?._id);
    if (!response?._id) return;
    setCurrentPoll(null);
    setCurrentPolls((prev) =>
      prev.filter((poll) => poll._id !== response?._id)
    );
    setSaving(false);
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
                  label="Title"
                  type="text"
                  variant="light"
                  autoComplete="off"
                />
                <label className={styles.label}>Options</label>
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
                <label className={styles.label}>Settings</label>
                <Input
                  name="allowMultipleChoices"
                  label="Allow multiple choices"
                  type="toggle"
                  variant="light"
                />
                <Input
                  name="showResults"
                  label="Show results"
                  type="toggle"
                  variant="light"
                  info="Participants will still be able to vote, until you hide the poll"
                />
                <div className={styles.buttonGroup}>
                  <button type="submit" className="focus-inset">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue('visible', !currentPoll.visible);
                      submitForm();
                    }}
                    className="focus-inset"
                  >
                    {currentPoll.visible ? 'Hide' : 'Start'}
                  </button>
                  <button
                    type="button"
                    className="button--ghost button--danger focus-inset"
                    onClick={handleDelete}
                    disabled={!currentPoll?._id}
                  >
                    Delete
                  </button>
                </div>
              </fieldset>
            </Form>
          )}
        </Formik>
      ) : (
        <div className={`centeredPlaceholder ${styles.placeholder}`}>
          Select or create a poll
        </div>
      )}
    </div>
  );
};
