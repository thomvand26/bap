import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SHOW } from '../routes';
import { useSocket } from './SocketContext';

export const ShowContext = createContext();
export const useShow = () => useContext(ShowContext);

export const ShowProvider = ({ children }) => {
  const [playingShows, setPlayingShows] = useState([]);
  const [currentShow, setCurrentShow] = useState();
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    console.log(socket);
    if (!socket) return;

    const handleRouteChange = (url) => {
      if (!url.startsWith(SHOW)) {
        leaveCurrentShow();
      }
    };

    socket.on('showUpdate', (data) => {
      setCurrentShow(data);
      // console.log('showUpdate', data);
    });

    // socket.on('clientsUpdate', (data) => {
    //   setConnectedSockets(data?.connectedSockets);
    // });

    socket.on('showsUpdate', (data) => {
      console.log(data);
      setPlayingShows(data?.shows);
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
  }, [socket]);

  function leaveCurrentShow(callback) {
    if (!socket) return;
    console.log('leaving show');
    socket.emit('leaveRequest', callback);
  }

  const createShow = (data, callback) => {
    // Via Api/DB
    // console.log('emitting');
    if (!socket) return;
    socket.emit('createRequest', data, callback);
  };

  const joinShow = (showId, callback) => {
    if (!socket) return;
    socket.emit('joinRequest', showId, callback);
  };

  const sendChat = (chat, message) => {
    console.log(socket);
    if (!socket) return;
    console.log('sending chat', currentShow?.showId, chat, message);
    socket.emit('sendChat', currentShow?.showId, chat, message);
  };

  const goToShow = (showId) => {
    // console.log(showId);
    router.push(`${SHOW}/${showId}`);
  };

  const exports = {
    playingShows,
    createShow,
    joinShow,
    currentShow,
    sendChat,
    goToShow,
  };

  return (
    <ShowContext.Provider value={exports}>{children}</ShowContext.Provider>
  );
};
