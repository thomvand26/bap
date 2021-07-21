import React, { createContext, useContext, useState } from 'react';

import { GlobalModal } from '@/components';

export const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState();

  const exports = {
    setModalData,
    modalData,
  };

  return (
    <ModalContext.Provider value={exports}>
      <GlobalModal />
      {children}
    </ModalContext.Provider>
  );
};
