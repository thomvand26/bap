import React, { useEffect } from 'react';
import FocusTrap from 'focus-trap-react';

import { useModal } from '@/context';

import styles from './GlobalModal.module.scss';

export const GlobalModal = () => {
  const { modalData, setModalData } = useModal();

  useEffect(() => {
    document.body.style.overflow = modalData ? 'hidden' : 'initial';
  }, [modalData]);

  const handleContainerClick = (event) => {
    if (modalData?.keepOpen) return;
    if (event.currentTarget !== event.target) return;
    setModalData(null);
  };

  return modalData ? (
    <div
      className={`container ${styles.container}`}
      onClick={handleContainerClick}
    >
      <FocusTrap>
        <div className={`container__content ${styles.content}`}>
          {modalData?.heading && (
            <h2 className={styles.heading}>{modalData.heading}</h2>
          )}
          {modalData?.intro && (
            <p className={styles.intro}>{modalData.intro}</p>
          )}
          {!!modalData?.actions?.length && (
            <div className={styles.actionList}>
              {modalData.actions.map((action, i) => (
                <button
                  key={i}
                  className={`${
                    action.type == 'danger'
                      ? 'button--ghost button--danger'
                      : ''
                  }`}
                  onClick={action.onClick}
                >
                  {action.text}
                </button>
              ))}
            </div>
          )}
          {modalData?.children && <modalData.children />}
        </div>
      </FocusTrap>
    </div>
  ) : (
    <></>
  );
};
