import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SHOW } from '../routes';

export const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState();
  const [ownSocketData, setOwnSocketData] = useState();
  const [connectedSockets, setConnectedSockets] = useState([]);
  const [shows, setShows] = useState([]);
  const [currentShow, setCurrentShow] = useState();
  const [socket, setSocket] = useState(() => io());
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.startsWith(SHOW)) {
        leaveCurrentShow();
      }
    };

    socket.on('selfUpdate', (data) => {
      setOwnSocketData((prev) => ({ ...prev, ...data }));
    });

    socket.on('showUpdate', (data) => {
      setCurrentShow(data);
      // console.log('showUpdate', data);
    });

    socket.on('clientsUpdate', (data) => {
      setConnectedSockets(data?.connectedSockets);
    });

    socket.on('showsUpdate', (data) => {
      console.log(data);
      setShows(data?.shows);
    });

    socket.on('chatUpdate', ({ chat, message }) => {
      console.log(chat, message);
      setCurrentShow((prev) => {
        if (!prev || !chat || !message) return;
        const updatedShow = { ...prev };
        const prevChat = updatedShow?.chats?.[chat];
        updatedShow.chats = prev.chats ? prev.chats : {};
        updatedShow.chats[chat] = prevChat?.length
          ? [...prevChat, message]
          : [message];
        return updatedShow;
      });
    });

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  function leaveCurrentShow(callback) {
    console.log('leaving');
    socket.emit('leaveRequest', callback);
  }

  const createShow = (data, callback) => {
    console.log('emitting');
    socket.emit('createRequest', data, callback);
  };

  const joinShow = (showId, callback) => {
    socket.emit('joinRequest', showId, callback);
  };

  const sendChat = (chat, message) => {
    socket.emit('sendChat', currentShow?.showId, chat, message);
  };

  const goToShow = (showId) => {
    // console.log(showId);
    router.push(`${SHOW}/${showId}`);
  };

  const exports = {
    sessionId,
    setSessionId,
    connectedSockets,
    shows,
    createShow,
    joinShow,
    currentShow,
    sendChat,
    goToShow,
  };

  return (
    <SessionContext.Provider value={exports}>
      {children}
    </SessionContext.Provider>
  );
};
