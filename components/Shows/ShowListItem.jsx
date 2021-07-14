import React, { useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa';
import {
  MdContentCopy,
  MdDashboard,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';

import { useShow } from '@/context';
import { EDIT_SHOW } from '@/routes';

import styles from './showListItem.module.scss';

export const showListItemVariants = Object.freeze({
  playing: 0,
  planned: 1,
  artistDashboard: 2,
});

/**
 * variant: one of: "playing", "planned", "artistDashboard"
 */
export const ShowListItem = ({ show, variant = 'playing' }) => {
  const { goToShow, saveShow, deleteShow, setCurrentShow } = useShow();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <div className={styles.container}>
      <div className={styles.showName}>{show?.title}</div>
      <div className={styles.middle}>
        {`${moment(show?.startDate).format(
          'DD-MM-YYYY'
        )}\u00A0\u00A0|\u00A0\u00A0${moment(show?.startDate).format(
          'HH:mm'
        )} - ${moment(show?.endDate).format('HH:mm')}`}
      </div>
      <div className={styles.actions}>
        {variant === 'playing' ? (
          <>
            <div className="watching">x watchers</div>
            <button onClick={handleJoinClick}>Join</button>
          </>
        ) : variant === 'planned' ? (
          <button onClick={handleRemindClick}>Remind me!</button>
        ) : (
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
        )}
      </div>
    </div>
  );
};
