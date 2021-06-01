import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import moment from 'moment';
import { FaTrash } from 'react-icons/fa';
import {
  MdContentCopy,
  MdDashboard,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';

import { useShow, useDatabase } from '@/context';
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
export const ShowListItem = ({
  show,
  variant = 'playing',
  onDuplicate,
  onDelete,
}) => {
  const { goToShow, saveShow } = useShow();
  const { dbDeleteShow } = useDatabase();
  const router = useRouter();
  const [session] = useSession();
  const [thisShow, setThisShow] = useState(show);

  useEffect(() => {
    setThisShow(show);
  }, [show]);

  const handleJoinClick = () => {
    if (!thisShow) return;

    goToShow(thisShow._id);
  };

  const handleEditClick = () => {
    if (!thisShow) return;

    router.push({
      pathname: EDIT_SHOW,
      query: { showId: thisShow._id },
    });
  };

  const handleDuplicateClick = async () => {
    if (!thisShow) return;

    let duplicateShow = { ...thisShow };

    delete duplicateShow._id;
    delete duplicateShow.owner;

    try {
      const savedShow = await saveShow(duplicateShow);

      if (onDuplicate instanceof Function) {
        onDuplicate(savedShow);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemindClick = () => {
    console.log('toggle reminder');
  };

  const handleDeleteClick = async () => {
    if (!thisShow) return;

    try {
      await dbDeleteShow(thisShow, session?.user?._id);

      if (onDelete instanceof Function) {
        onDelete(thisShow._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHideClick = async () => {
    if (!thisShow) return;

    const savedShow = await saveShow({
      _id: thisShow._id,
      visible: !thisShow.visible,
    });

    setThisShow(savedShow);
  };

  return (
    <div className={styles.container}>
      <div className={styles.showName}>{thisShow?.title}</div>
      <div className={styles.middle}>
        {`${moment(thisShow?.startDate).format(
          'DD-MM-YYYY'
        )}\u00A0\u00A0|\u00A0\u00A0${moment(thisShow?.startDate).format(
          'HH:mm'
        )} - ${moment(thisShow?.endDate).format('HH:mm')}`}
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
            <button className="button button--icon" onClick={handleHideClick}>
              {thisShow?.visible ? (
                <MdVisibility size="1.7rem" />
              ) : (
                <MdVisibilityOff size="1.7rem" />
              )}
            </button>
            <button className="button button--icon" onClick={handleEditClick}>
              <MdDashboard size="1.6rem" />
            </button>
            <button
              className="button button--icon"
              onClick={handleDuplicateClick}
            >
              <MdContentCopy size="1.6rem" />
            </button>
            <button
              className="button button--icon button--danger"
              onClick={handleDeleteClick}
            >
              <FaTrash size="1.4rem" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
