import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { FaTrash, FaUser } from 'react-icons/fa';
import {
  MdContentCopy,
  MdDashboard,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { useTranslation } from 'next-i18next';
import * as CalendarLink from 'calendar-link';

import { useShow, useModal } from '@/context';
import { LoadingSpinner } from '@/components';
import { EDIT_SHOW, SHOW } from '@/routes';
import {
  convertToUniqueParticipantsArray,
  isShowIsCurrentlyPlaying,
  useWindowSize,
} from '@/utils';
import { appConfig, breakpoints } from '@/config';

import styles from './ShowListItem.module.scss';

/**
 * variant: one of: "default", "artistDashboard"
 */
export const ShowListItem = ({ show, variant = 'default', cards }) => {
  const { goToShow, saveShow, deleteShow, setCurrentShow } = useShow();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isPlaying = isShowIsCurrentlyPlaying(show);
  const { width } = useWindowSize();
  const { setModalData } = useModal();
  const { t } = useTranslation(['shows']);

  const [calendarLinks, setCalendarLinks] = useState({});

  useEffect(() => {
    const calendarEvent = {
      title: `${appConfig.appName} - ${show?.title}`,
      description: `${appConfig.appName} show: <a href="${appConfig.baseUrl}${SHOW}/${show?._id}" >${show?.title}</a>`,
      start: show?.startDate,
      end: show?.endDate,
    };

    setCalendarLinks({
      google: CalendarLink?.google(calendarEvent),
      office365: CalendarLink?.office365(calendarEvent),
    });
  }, [show]);

  const Date = () => {
    return isPlaying && variant !== 'artistDashboard' ? (
      `${t('shows:until')} ${moment(show?.endDate).format('HH:mm')}`
    ) : width <= breakpoints.l ? (
      <>
        <span>{moment(show?.startDate).format('DD-MM-YYYY')}</span>
        <br />
        <span className={styles.date__hour}>
          {moment(show?.startDate).format('HH:mm')} -{' '}
          {moment(show?.endDate).format('HH:mm')}
        </span>
      </>
    ) : (
      `${moment(show?.startDate).format(
        'DD-MM-YYYY'
      )}\u00A0\u00A0|\u00A0\u00A0${moment(show?.startDate).format(
        'HH:mm'
      )} - ${moment(show?.endDate).format('HH:mm')}`
    );
  };

  const handleJoinClick = () => {
    if (!show) return;

    goToShow(show._id);
  };

  const handleEditClick = () => {
    if (!show) return;

    setCurrentShow(show);

    router.push({
      pathname: EDIT_SHOW,
      query: { showId: show._id },
    });
  };

  const handleDuplicateClick = async () => {
    if (!show) return;

    let duplicateShow = { ...show };

    delete duplicateShow._id;
    delete duplicateShow.owner;

    try {
      setLoading(true);
      await saveShow(duplicateShow);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleAddCalendarClick = () => {
    setModalData({
      heading: t('shows:add-to-calendar'),
      children: () => (
        <div className={styles.calendarModal}>
          <ul>
            <li>
              <a href={calendarLinks.google} target="_blank">
                Google
              </a>
            </li>
            <li>
              <a href={calendarLinks.office365} target="_blank">
                Office365
              </a>
            </li>
          </ul>
          <button type="button" onClick={() => setModalData(null)}>
            {t('shows:add-to-calendar-close')}
          </button>
        </div>
      ),
    });
  };

  const handleDeleteClick = async () => {
    if (!show) return;

    try {
      setLoading(true);
      await deleteShow(show);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleHideClick = async () => {
    if (!show) return;
    setLoading(true);
    await saveShow({
      _id: show._id,
      public: !show.public,
    });
    setLoading(false);
  };

  return (
    <div
      className={`${styles.container} ${
        cards ? styles['container--cards'] : ''
      } ${
        variant === 'artistDashboard' ? styles['container--inDashboard'] : ''
      }`}
    >
      {show ? (
        width <= breakpoints.l && variant !== 'artistDashboard' ? (
          <>
            <div className={styles.showName}>{show?.title}</div>
            <div className={styles.mobileBottom}>
              <div className={styles.info}>
                <div className={styles.date}>
                  <Date />
                </div>
                <div className={styles.watching}>
                  <FaUser className={styles.watching__icon} size="1.4rem" />
                  {
                    convertToUniqueParticipantsArray(show?.connectedUsers)
                      ?.length
                  }
                </div>
              </div>
              {isPlaying && variant !== 'artistDashboard' ? (
                <button
                  className={styles.mobileButton}
                  onClick={handleJoinClick}
                >
                  {t('shows:join')}
                </button>
              ) : (
                <button
                  className={styles.mobileButton}
                  onClick={handleAddCalendarClick}
                >
                  {t('shows:add-to-calendar')}
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.showName}>{show?.title}</div>
            <div className={styles.middle}>
              <Date />
            </div>
            <div className={styles.actions}>
              {variant === 'artistDashboard' ? (
                <>
                  <button
                    className="button button--icon"
                    onClick={handleHideClick}
                    disabled={loading}
                  >
                    {show?.public ? (
                      <MdVisibility size="1.7rem" />
                    ) : (
                      <MdVisibilityOff size="1.7rem" />
                    )}
                  </button>
                  <button
                    className="button button--icon"
                    onClick={handleEditClick}
                    disabled={loading}
                  >
                    <MdDashboard size="1.6rem" />
                  </button>
                  <button
                    className="button button--icon"
                    onClick={handleDuplicateClick}
                    disabled={loading}
                  >
                    <MdContentCopy size="1.6rem" />
                  </button>
                  <button
                    className="button button--icon button--danger"
                    onClick={handleDeleteClick}
                    disabled={loading}
                  >
                    <FaTrash size="1.4rem" />
                  </button>
                </>
              ) : isPlaying ? (
                <>
                  <div className={styles.watching}>
                    <FaUser className={styles.watching__icon} size="1.4rem" />
                    {
                      convertToUniqueParticipantsArray(show?.connectedUsers)
                        ?.length
                    }
                  </div>
                  <button onClick={handleJoinClick}>{t('shows:join')}</button>
                </>
              ) : (
                <button onClick={handleAddCalendarClick}>
                  {t('shows:add-to-calendar')}
                </button>
              )}
            </div>
          </>
        )
      ) : (
        <LoadingSpinner horizontal={!cards} size={!cards ? 'small' : ''} />
      )}
    </div>
  );
};
