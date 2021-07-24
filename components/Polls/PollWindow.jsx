import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { Field, Form, Formik } from 'formik';

import { getHighestPollOption, getTotalPollVotes } from '@/utils';
import { useShow } from '@/context';
import { InfoHover } from '@/components';

import styles from './PollWindow.module.scss';

export const PollWindow = () => {
  const [session] = useSession();
  const { presentedPoll, votePoll } = useShow();
  const [choices, setChoices] = useState([]);
  const [saving, setSaving] = useState();

  useEffect(() => {
    setChoices(
      presentedPoll?.options
        ?.filter?.((option) =>
          option.voters.find((userId) => `${userId}` === session?.user?._id)
        )
        ?.map?.((option) => option._id) || []
    );
  }, [presentedPoll]);

  const handleSubmit = async (data) => {
    if (saving) return;
    setSaving(true);
    await votePoll({ pollId: presentedPoll?._id, optionIds: data.optionIds });
    setSaving(false);
  };

  return presentedPoll ? (
    <div className={`${styles.container}`}>
      <div className={styles.pollTitleContainer}>
        <h3 className={styles.pollTitle}>{presentedPoll.pollTitle}</h3>
        <InfoHover content="By saving you agree that your anwser will be saved and shared." />
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          optionIds: choices,
        }}
        onSubmit={handleSubmit}
      >
        {({ values: { optionIds } }) => (
          <Form>
            <fieldset disabled={saving}>
              <ul>
                {[...presentedPoll.options]
                  .sort(
                    (optionA, optionB) => optionA.position - optionB.position
                  )
                  .map((option, i) => {
                    return (
                      <li key={i} className={styles.optionContainer}>
                        <label
                          htmlFor={`${option.optionName}-${i}`}
                          className={`${styles.option} ${
                            saving ? styles['option--disabled'] : ''
                          }`}
                        >
                          <div
                            className={`${styles.checkbox} ${
                              optionIds?.includes?.(option._id)
                                ? styles['checkbox--checked']
                                : ''
                            }`}
                          ></div>
                          <Field
                            type="checkbox"
                            name={'optionIds'}
                            value={option._id}
                            className={styles.option__input}
                            id={`${option.optionName}-${i}`}
                          />
                          <span className={styles.option__label}>
                            {option.optionName}
                          </span>
                        </label>
                        {presentedPoll?.showResults && (
                          <div
                            className={`${styles.percentage} ${
                              getHighestPollOption(presentedPoll).voters
                                .length === option.voters.length
                                ? styles['percentage--highest']
                                : ''
                            }`}
                          >
                            {Math.round(
                              (option.voters.length /
                                getTotalPollVotes(presentedPoll) || 0) * 100
                            )}
                            %
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
              <button
                type="submit"
                className={`button--mini ${styles.saveButton}`}
              >
                Save
              </button>
            </fieldset>
          </Form>
        )}
      </Formik>
    </div>
  ) : (
    <></>
  );
};
