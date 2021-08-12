import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import FocusTrap from 'focus-trap-react';

import { useShow } from '@/context';
import { ParticipantsList } from './ParticipantsList';

import styles from './ParticipantsButton.module.scss';

export const ParticipantsButton = ({ inDashboard, disabled }) => {
  const { uniqueParticipants } = useShow();
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <FocusTrap
      active={showParticipants}
      focusTrapOptions={{ allowOutsideClick: true }}
    >
      <div
        className={`${styles.container} ${
          inDashboard ? styles['container--inDashboard'] : ''
        } ${showParticipants ? styles['container--open'] : ''}`}
      >
        <button
          type="button"
          className={`button--mini ${styles.button}`}
          onClick={() => setShowParticipants((prev) => !prev)}
          disabled={disabled || showParticipants}
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
    </FocusTrap>
  );
};
