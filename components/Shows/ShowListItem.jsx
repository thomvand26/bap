import React, { useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { FaTrash, FaUser } from 'react-icons/fa';
import {
  MdContentCopy,
  MdDashboard,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';

import { useShow } from '@/context';
import { LoadingSpinner } from '@/components';
import { EDIT_SHOW } from '@/routes';
import {
  convertToUniqueParticipantsArray,
  isShowIsCurrentlyPlaying,
  useWindowSize,
} from '@/utils';
import { breakpoints } from '@/config';

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

  const Date = () => {
    return isPlaying && variant !== 'artistDashboard' ? (
      `Until ${moment(show?.endDate).format('HH:mm')}`
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
    // TODO
    console.log('Add to calendar');
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
      visible: !show.visible,
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
                  Join
                </button>
              ) : (
                <button
                  className={styles.mobileButton}
                  onClick={handleAddCalendarClick}
                >
                  Add to calendar
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
                    {show?.visible ? (
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
                  <button onClick={handleJoinClick}>Join</button>
                </>
              ) : (
                <button onClick={handleAddCalendarClick}>
                  Add to calendar
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
