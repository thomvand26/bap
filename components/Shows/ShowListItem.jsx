import React from 'react';
import moment from 'moment';

import { useShow, useDatabase } from '@/context';

import { EDIT_SHOW } from '@/routes';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';

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
  const { goToShow } = useShow();
  const { dbDeleteShow } = useDatabase();
  const router = useRouter();
  const [session] = useSession();

  const handleJoinClick = () => {
    if (!show) return;
    goToShow(show._id);
  };

  const handleEditClick = () => {
    if (!show) return;
    router.push({
      pathname: EDIT_SHOW,
      query: { showId: show._id },
    });
  };

  const handleRemindClick = () => {
    console.log('toggle reminder');
  };

  const handleDeleteClick = async () => {
    const response = await dbDeleteShow(show, session?.user?._id);
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
            <button className="button button--fit" onClick={handleJoinClick}>Hide</button>
            <button className="button button--fit" onClick={handleEditClick}>Settings</button>
            <button className="button button--fit" onClick={handleJoinClick}>Copy</button>
            <button className="button button--fit" onClick={handleDeleteClick}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
};
