import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SHOW } from '../routes';
import { useDatabase } from './DatabaseContext';
import { useSocket } from './SocketContext';

export const ShowContext = createContext();
export const useShow = () => useContext(ShowContext);

export const ShowProvider = ({ children }) => {
  const [playingShows, setPlayingShows] = useState([]);
  const [currentShow, setCurrentShow] = useState();
  const [currentChatroom, setCurrentChatroom] = useState();
  const { socket } = useSocket();
  const { dbSaveShow, dbDeleteShow } = useDatabase();
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log(socket);
    if (!socket) return;

    const handleRouteChange = (url) => {
      if (!url.startsWith(SHOW)) {
        leaveCurrentShow();
      }
    };

    socket.on('showUpdate', (data) => {
      // console.log('showUpdate', data);
      // setCurrentShow(data);
      // console.log('showUpdate', data);
    });

    // socket.on('clientsUpdate', (data) => {
    //   setConnectedSockets(data?.connectedSockets);
    // });

    socket.on('showsUpdate', (data) => {
      // console.log(data);
      setPlayingShows(data?.shows);
    });

    socket.on('chatUpdate', ({ type, message }) => {
      // console.log(type, message);
      setCurrentChatroom((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
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

  const saveShow = async (data, callback) => {
    const userId = session?.user?._id;
    if (!userId) {
      console.log('no user id');
      return;
    }
    const newShow = await dbSaveShow({ ...data, owner: userId });
    return newShow;
  };

  const deleteShow = async (data, callback) => {
    const userId = session?.user?._id;
    if (!userId) {
      console.log('no user id');
      return;
    }
    const deletedShow = await dbDeleteShow({ ...data, owner: userId });
    return deletedShow;
  };

  const joinShow = (showId, callback) => {
    if (!socket) return;
    socket.emit('joinRequest', showId, null, (response) => {
      if (response?.type === 'success') {
        setCurrentShow(response.data.show);
        setCurrentChatroom({ messages: response.data.chat });
      }
      callback?.(response);
    });
  };

  const sendChat = (message, chat) => {
    if (!socket) return;
    // console.log('emit', socket, currentShow, message);
    socket.emit(
      'sendChat',
      currentShow?._id,
      chat ||
        currentChatroom?._id ||
        currentShow?.generalChatroom?._id ||
        'general',
      // 'general',
      session?.user?._id,
      message
    );
  };

  const goToShow = (showId) => {
    router.push(`${SHOW}/${showId}`);
  };

  const exports = {
    playingShows,
    setCurrentShow,
    saveShow,
    deleteShow,
    joinShow,
    currentShow,
    currentChatroom,
    sendChat,
    goToShow,
  };

  return (
    <ShowContext.Provider value={exports}>{children}</ShowContext.Provider>
  );
};
