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
} from '@/utils';

import styles from './showListItem.module.scss';

/**
 * variant: one of: "default", "artistDashboard"
 */
export const ShowListItem = ({ show, variant = 'default', cards }) => {
  const { goToShow, saveShow, deleteShow, setCurrentShow } = useShow();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isPlaying = isShowIsCurrentlyPlaying(show);

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

  const handleRemindClick = () => {
    console.log('toggle reminder');
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
      }`}
    >
      {show ? (
        <>
          <div className={styles.showName}>{show?.title}</div>
          <div className={styles.middle}>
            {isPlaying && variant !== 'artistDashboard'
              ? `Until ${moment(show?.endDate).format('HH:mm')}`
              : `${moment(show?.startDate).format(
                  'DD-MM-YYYY'
                )}\u00A0\u00A0|\u00A0\u00A0${moment(show?.startDate).format(
                  'HH:mm'
                )} - ${moment(show?.endDate).format('HH:mm')}`}
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
              <button onClick={handleRemindClick}>Remind me!</button>
            )}
          </div>
        </>
      ) : (
        <LoadingSpinner horizontal={!cards} size={!cards ? 'small' : ''} />
      )}
    </div>
  );
};
