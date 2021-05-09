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
  const { socket } = useSocket();
  const { dbSaveShow, dbDeleteShow } = useDatabase();
  const [session] = useSession();
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
    socket.emit('joinRequest', showId, callback);
  };

  const sendChat = (chat, message) => {
    if (!socket) return;
    socket.emit('sendChat', currentShow?.showId, chat, message);
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
    sendChat,
    goToShow,
  };

  return (
    <ShowContext.Provider value={exports}>{children}</ShowContext.Provider>
  );
};
