import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';

import { useShow } from '@/context';
import { ParticipantsList } from './ParticipantsList';

import styles from './ParticipantsButton.module.scss';

export const ParticipantsButton = ({ inDashboard }) => {
  const { uniqueParticipants } = useShow();
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <div
      className={`${styles.container} ${
        inDashboard ? styles['container--inDashboard'] : ''
      } ${showParticipants ? styles['container--open'] : ''}`}
    >
      <button
        type="button"
        className={`button--mini ${styles.button}`}
        onClick={() => setShowParticipants((prev) => !prev)}
      >
        <FaUser className={styles.icon} />
        {uniqueParticipants.length || 0}
      </button>
      {showParticipants && (
        <ParticipantsList
          setShowParticipants={setShowParticipants}
          inDashboard={inDashboard}
        />
      )}
    </div>
  );
};
