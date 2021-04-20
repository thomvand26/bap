import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [ownSocketData, setOwnSocketData] = useState();
  const [socket] = useState(() => io());
  const router = useRouter();

  useEffect(() => {
    socket.on('selfUpdate', (data) => {
      setOwnSocketData((prev) => ({ ...prev, ...data }));
    });
  }, []);

  const exports = {
    socket,
    ownSocketData,
  };

  return (
    <SocketContext.Provider value={exports}>{children}</SocketContext.Provider>
  );
};
