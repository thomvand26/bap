import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState();
  const [ownSocketData, setOwnSocketData] = useState();
  const [connectedSockets, setConnectedSockets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState();
  const [socket, setSocket] = useState(() => io());
  const router = useRouter();

  useEffect(() => {
    socket.on('selfUpdate', (data) => {
      setOwnSocketData((prev) => ({ ...prev, ...data }));
    });

    socket.on('roomUpdate', (data) => {
      setCurrentRoom(data);
      // console.log('roomUpdate', data);
    });

    socket.on('clientsUpdate', (data) => {
      setConnectedSockets(data?.connectedSockets);
    });

    socket.on('roomsUpdate', (data) => {
      setRooms(data?.rooms);
    });

    socket.on('chatUpdate', ({ chat, message }) => {
      console.log(chat, message);
      setCurrentRoom((prev) => {
        if (!prev || !chat || !message) return;
        const updatedRoom = { ...prev };
        const prevChat = updatedRoom?.chats?.[chat];
        updatedRoom.chats = prev.chats ? prev.chats : {};
        updatedRoom.chats[chat] = prevChat?.length
          ? [...prevChat, message]
          : [message];
        return updatedRoom;
      });
    });
  }, []);

  // useEffect(() => {
  //   console.log(connectedSockets);
  // }, [connectedSockets]);
  // useEffect(() => {
  //   console.log(rooms);
  // }, [rooms]);
  // useEffect(() => {
  //   console.log(ownSocketData);
  // }, [ownSocketData]);
  // useEffect(() => {
  //   const roomId = ownSocketData?.room?.id;
  //   if (!roomId) return;
  //   console.log(ownSocketData?.room);
  //   router.push(`${ROUTE_ROOM}/${roomId}`);
  // }, [ownSocketData?.room?.id]);

  const createRoom = (callback) => {
    socket.emit('createRequest', callback);
  };

  const joinRoom = (roomId, callback) => {
    socket.emit('joinRequest', roomId, callback);
  };

  const sendChat = (chat, message) => {
    socket.emit('sendChat', currentRoom?.roomId, chat, message);
  };

  const exports = {
    sessionId,
    setSessionId,
    connectedSockets,
    rooms,
    createRoom,
    joinRoom,
    currentRoom,
    sendChat,
  };

  return (
    <SessionContext.Provider value={exports}>
      {children}
    </SessionContext.Provider>
  );
};
