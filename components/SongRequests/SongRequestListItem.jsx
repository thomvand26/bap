import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { MdMoreVert, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { ImArrowUp } from 'react-icons/im';
import { FaTimes, FaTrash } from 'react-icons/fa';

import { useShow } from '@/context';

import styles from './SongRequests.module.scss';

export const SongRequestListItem = ({ songRequest, inDashboard }) => {
  const [session] = useSession();
  const { voteSongRequest, hideSongRequest, deleteSongRequest } = useShow();

  const [hasVoted, setHasVoted] = useState();
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setHasVoted(
      songRequest?.upVoters?.find?.(
        (upVoter) => (upVoter?._id || upVoter) === session?.user?._id
      )
    );
  }, [songRequest]);

  const handleHide = async () => {
    if (loading) return;

    setLoading(true);

    await hideSongRequest({
      songRequestId: songRequest?._id,
      visible: !songRequest?.visible,
    });

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);

    await deleteSongRequest({
      songRequestId: songRequest?._id,
    });

    setLoading(false);
  };

  const handleVote = async () => {
    if (loading) return;

    setLoading(true);

    await voteSongRequest({
      songRequestId: songRequest?._id,
      addVote: !hasVoted,
    });

    setLoading(false);
  };

  return (
    <li
      className={`${styles.listItem} ${
        inDashboard ? styles['listItem--inDashboard'] : ''
      } ${!songRequest?.visible ? styles['listItem--hidden'] : ''}`}
    >
      {inDashboard && (
        <div
          className={`${styles.userName} ${
            !songRequest?.visible ? styles['userName--hidden'] : ''
          }`}
        >
          {songRequest?.owner?.username}
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.song}>{songRequest?.song}</div>
        <div className={styles.actions}>
          <div className={styles.voteCount}>
            {songRequest?.upVoters?.length}
            {inDashboard && <ImArrowUp className={styles.voteCount__arrow} />}
          </div>
          {inDashboard ? (
            <button
              className={`button--icon button--noMinHeight focus-inset ${styles.menu__toggleButton}`}
              onClick={() => setShowMenu(true)}
            >
              <MdMoreVert size="1.4rem" />
            </button>
          ) : (
            <button
              className={`button--icon button--hover-light ${
                styles.voteButton
              } ${hasVoted ? styles['voteButton--voted'] : ''}`}
              onClick={handleVote}
            >
              <ImArrowUp className={styles.voteButton__arrow} />
            </button>
          )}
          {inDashboard && showMenu && (
            <div className={`${styles.menu}`}>
              <button
                className={`button--icon button--noMinHeight`}
                onClick={handleHide}
              >
                {songRequest?.visible ? (
                  <MdVisibility size="1.7rem" />
                ) : (
                  <MdVisibilityOff size="1.7rem" />
                )}
              </button>

              <button
                className={`button--icon button--danger button--noMinHeight`}
                onClick={handleDelete}
              >
                <FaTrash size="1.2rem" />
              </button>

              <button
                className={`button--icon button--noMinHeight ${styles.menu__toggleButton}`}
                onClick={() => setShowMenu(false)}
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};
