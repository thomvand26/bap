import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import axios from 'axios';

import {
  API_CHAT,
  API_CHATROOM,
  API_POLL,
  API_POLLS,
  API_SHOW,
  API_SONG_REQUEST,
  LANDING,
  SHOW,
} from '../routes';
import { useSocket } from './SocketContext';
import { defaultSongRequestArraySort } from '@/server/utils/songRequestUtils';
import {
  convertToUniqueParticipantsArray,
  removeDocumentFromArrayState,
  upsertDocumentInArrayState,
} from '@/utils';

export const ShowContext = createContext();
export const useShow = () => useContext(ShowContext);

export const ShowProvider = ({ children }) => {
  const { socket } = useSocket();
  const [session] = useSession();
  const router = useRouter();

  // Shows
  const [loadingShow, setLoadingShow] = useState(true);
  const [fetchedShows, setFetchedShows] = useState([]);
  const [currentShow, setCurrentShow] = useState();
  const [uniqueParticipants, setUniqueParticipants] = useState([]);
  const [ownShows, setOwnShows] = useState([]);

  // Chat
  const [loadingChat, setLoadingChat] = useState();
  const [availableChatrooms, setAvailableChatrooms] = useState([]);
  const [currentChatroom, setCurrentChatroom] = useState();
  const [uniqueParticipantsInChatroom, setUniqueParticipantsInChatroom] =
    useState([]);
  const [ownChatroom, setOwnChatroom] = useState();
  const [showChatroomSettings, setShowChatroomSettings] = useState();
  const [openChatMessage, setOpenChatMessage] = useState();
  const [chatModalQueue, setChatModalQueue] = useState([]);

  // Song requests
  const [currentSongRequests, setCurrentSongRequests] = useState([]);

  // Polls
  const [loadingPolls, setLoadingPolls] = useState();
  const [currentPolls, setCurrentPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState();
  const [presentedPoll, setPresentedPoll] = useState();

  useEffect(() => {
    if (!socket) return;

    const handleRouteChange = (url) => {
      if (!url.startsWith(SHOW)) {
        leaveCurrentShow();
      }
    };

    socket.on('showUpdate', ({ type, show }) => {
      // console.log('showUpdate', type, show);
      if (!show) return;
      setCurrentShow(show);
    });

    socket.on('showsUpdate', ({ type, show }) => {
      // console.log('showsUpdate', type, show);
      if (!show) return;

      switch (type) {
        case 'delete':
          removeDocumentFromArrayState({
            setFunction: setFetchedShows,
            document: show,
          });

          break;

        case 'create':
        case 'update':
        default:
          upsertDocumentInArrayState({
            setFunction: setFetchedShows,
            document: show,
          });

          break;
      }
    });

    socket.on('chatroomInvite', (data) => {
      setChatModalQueue((prev) => {
        switch (data?.type) {
          case 'invite':
            return !prev.find(
              (chatModalData) =>
                JSON.stringify(chatModalData) === JSON.stringify(data)
            )
              ? [...prev, data]
              : prev;
          case 'cancel':
            return prev.filter(
              (chatModalData) =>
                JSON.stringify(chatModalData) !==
                JSON.stringify({ ...data, type: 'invite' })
            );
            break;
        }
      });
    });

    socket.on('chatUpdate', ({ type, message }) => {
      setCurrentChatroom((prev) => ({
        ...prev,
        messages:
          type === 'chatDelete'
            ? prev.messages.filter(
                (prevMessage) => prevMessage?._id !== message?._id
              )
            : [...prev.messages, message],
      }));
    });

    socket.on('songRequestUpdate', ({ type, updatedSongRequest }) => {
      console.log('songRequestUpdate', type, updatedSongRequest);
      setCurrentSongRequests((prev) =>
        defaultSongRequestArraySort(
          type === 'create'
            ? [...prev, updatedSongRequest]
            : type === 'delete'
            ? prev.filter(
                (songRequest) => songRequest._id !== updatedSongRequest._id
              )
            : // : type === 'hide'
              // ? prev.filter(
              //     (songRequest) => songRequest._id !== updatedSongRequest._id
              //   )
              // : type === 'update'
              prev.map((songRequest) =>
                songRequest._id === updatedSongRequest._id
                  ? updatedSongRequest
                  : songRequest
              )
        )
      );
    });

    socket.on('pollUpdate', ({ type, updatedPoll }) => {
      console.log('pollUpdate', type, updatedPoll);
      if (type !== 'delete') {
        setCurrentPolls((prev) =>
          prev.map((poll) =>
            poll._id === updatedPoll._id ? updatedPoll : poll
          )
        );
        setCurrentPoll((prev) =>
          prev?._id === updatedPoll._id ? updatedPoll : prev
        );
      }
      setPresentedPoll(
        type === 'delete' || !updatedPoll?.visible ? null : updatedPoll
      );
    });

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !session) return;

    const handleChatroomUpdate = ({ type, chatroom }) => {
      if (type === 'join') {
        setShowChatroomSettings(false);
        setChatModalQueue((prev) =>
          prev?.filter?.(
            (modal) =>
              !(modal?.type === 'invite' && modal?.chatroomId === chatroom?._id)
          )
        );
        upsertDocumentInArrayState({
          setFunction: setAvailableChatrooms,
          document: chatroom,
        });
      } else {
        setAvailableChatrooms((prev) => {
          const newAvailableChatrooms = prev?.map?.((prevChatroom) =>
            prevChatroom?._id === chatroom?._id
              ? { ...prevChatroom, chatroom }
              : prevChatroom
          );
          return newAvailableChatrooms;
        });
      }

      setCurrentChatroom((prev) =>
        prev?._id === chatroom?._id ? { ...prev, ...chatroom } : prev
      );

      if (
        (chatroom?.owner?._id || chatroom?.owner) === session?.user?._id &&
        !chatroom.isGeneral
      ) {
        setOwnChatroom((prev) => ({ ...prev, ...chatroom }));
      }
    };

    socket.on('chatroomUpdate', handleChatroomUpdate);

    return () => {
      socket.off('chatroomUpdate', handleChatroomUpdate);
    };
  }, [socket, session, currentChatroom]);

  useEffect(() => {
    if (!socket || !session) return;

    const handleKicked = ({ type, data }) => {
      console.log('kicked!', type, data);

      if (type === 'show') {
        setCurrentShow(null);
        setAvailableChatrooms([]);
        setCurrentChatroom(null);
        setOwnChatroom(null);
        setOpenChatMessage(null);
        setChatModalQueue([]);
        setCurrentSongRequests([]);
        setCurrentPolls([]);
        setCurrentPoll(null);
        setPresentedPoll(null);
        if (router.asPath.startsWith(`${SHOW}/${data?._id || data}`)) {
          router.push(LANDING);
        }
      } else if (type === 'chatroom') {
        const { originalChatroom, generalChatroom } = data;

        // Remove Chatroom from available rooms
        setAvailableChatrooms((prev) =>
          prev?.filter?.(
            (prevChatroom) => prevChatroom?._id !== originalChatroom?._id
          )
        );

        setCurrentChatroom((prev) => {
          if (prev?._id === originalChatroom?._id) {
            return {
              ...generalChatroom.chatroom,
              messages: generalChatroom.messages,
            };
          } else {
            return prev;
          }
        });

        setShowChatroomSettings(false);

        if (
          (originalChatroom?.owner?._id || originalChatroom?.owner) ===
            session?.user?._id &&
          !originalChatroom?.isGeneral
        ) {
          setOwnChatroom(null);
        }
      }
    };

    socket.on('kicked', handleKicked);

    return () => {
      socket.off('kicked', handleKicked);
    };
  }, [socket, session, currentChatroom]);

  useEffect(() => {
    if (!currentShow?.connectedUsers) return;

    setUniqueParticipants(
      convertToUniqueParticipantsArray(currentShow.connectedUsers)
    );
  }, [currentShow]);

  useEffect(() => {
    if (!currentChatroom?.participants) return;

    setUniqueParticipantsInChatroom(
      convertToUniqueParticipantsArray(currentChatroom.participants)
    );

    if (
      (currentChatroom?.owner?._id || currentChatroom?.owner) ===
        session?.user?._id &&
      !currentChatroom?.isGeneral
    ) {
      setOwnChatroom(currentChatroom);
    }
  }, [currentChatroom]);

  function leaveCurrentShow(callback) {
    if (!socket) return;
    console.log('leaving show');
    socket.emit('leaveRequest', callback);
  }

  const saveShow = async (data) => {
    console.log('saving show: ', data);

    const response = await axios.post(`${API_SHOW}/${data?._id || ''}`, data);

    if (response?.data?.success) {
      upsertDocumentInArrayState({
        setFunction: setOwnShows,
        document: response.data.data,
      });
      return response.data.data;
    }

    return response;
  };

  const deleteShow = async (data) => {
    console.log('deleting show: ', data);

    const response = await axios.delete(`${API_SHOW}/${data._id}`);

    if (response?.data?.success) {
      removeDocumentFromArrayState({
        setFunction: setOwnShows,
        document: data,
      });
      return response?.data?.data;
    }

    return response;
  };

  const joinShow = async ({ showId, mustBeOwner }) => {
    const userId = session?.user?._id;

    if (!socket?.id || !userId) return;
    setLoadingChat(true);
    setLoadingPolls(true);

    console.log(socket.id);

    let response;

    try {
      response = await axios.post(`${API_SHOW}/${showId}/join`, {
        mustBeOwner,
        socketId: socket.id,
      });
    } catch (error) {
      response = error;
    }

    if (!response?.data?.success) {
      setLoadingPolls(false);
      setLoadingChat(false);
      return;
    }

    const data = response.data.data;
    setCurrentShow(data.show);
    setCurrentChatroom({
      ...data.show.generalChatroom,
      messages: data.messages,
    });
    setAvailableChatrooms(data.availableChatrooms);
    setOwnChatroom(
      data.availableChatrooms.find(
        (chatroom) => chatroom?.owner?._id === userId && !chatroom?.isGeneral
      )
    );
    setCurrentSongRequests(defaultSongRequestArraySort(data.songRequests));
    setPresentedPoll(data.presentedPoll);
    setLoadingChat(false);
    setLoadingPolls(false);

    return data;
  };

  const createChatroom = async ({ name }) => {
    if (!socket || !currentShow) return;

    setLoadingChat(true);

    const response = await axios.post(API_CHATROOM, {
      showId: currentShow._id,
      socketId: socket.id,
      name,
    });

    if (response?.data?.success) {
      const { chatroom, messages } = response.data.data;

      setCurrentChatroom({ ...chatroom, messages });
      setShowChatroomSettings(false);
      setAvailableChatrooms((prev) =>
        prev?.find(
          (prevChatroom) => `${prevChatroom?._id}` === `${chatroom?._id}`
        )
          ? prev
          : [...prev, chatroom]
      );
      setOwnChatroom(chatroom);
    }

    setLoadingChat(false);

    return response;
  };

  const updateChatroom = async ({ name }) => {
    if (!socket || !currentShow) return;

    setLoadingChat(true);

    const response = await axios.post(API_CHATROOM, {
      showId: currentShow._id,
      socketId: socket.id,
      name,
    });

    if (response?.data?.success) {
      const { chatroom, messages } = response.data.data;
      setCurrentChatroom({
        ...chatroom,
        messages,
      });

      // For update:
      setAvailableChatrooms((prev) =>
        prev.map((prevChatroom) =>
          prevChatroom?._id === chatroom._id ? chatroom : prevChatroom
        )
      );
    }

    setLoadingChat(false);

    return response;
  };

  const deleteChatroom = async ({ chatroomId }) => {
    if (!chatroomId) return;

    console.log('deleting chatroom: ', chatroomId);

    setLoadingChat(true);

    const response = await axios.delete(`${API_CHATROOM}/${chatroomId}`);

    setLoadingChat(false);

    return response;
  };

  const joinChatroom = async (chatroomId) => {
    setLoadingChat(true);

    const response = await axios.post(`${API_CHATROOM}/${chatroomId}/join`, {
      socketId: socket.id,
    });

    console.log('join chatroom', response);

    if (response?.data?.success) {
      setCurrentChatroom({
        ...response.data.data.chatroom,
        messages: response.data.data.messages,
      });
    }

    setLoadingChat(false);

    return response;
  };

  const leaveChatroom = async (chatroomId) => {
    setLoadingChat(true);

    const response = await axios.post(`${API_CHATROOM}/${chatroomId}/leave`, {
      socketId: socket.id,
    });

    setLoadingChat(false);

    console.log('leave chatroom', response);

    return response;
  };

  const inviteToChatroom = async ({ chatroomId, userId, cancel }) => {
    const response = await axios.post(`${API_CHATROOM}/${chatroomId}/invite`, {
      userId,
      showId: currentShow?._id,
      cancel,
      socketId: socket?.id,
    });

    console.log(`${cancel ? 'cancel from' : 'invite to'} chatroom`, response);

    return response;
  };

  const kickFromChatroom = async ({ userId, chatroomId }) => {
    if (!userId || !chatroomId) return;
    console.log('kicking user: ', userId);

    const response = await axios.post(`${API_CHATROOM}/${chatroomId}/kick`, {
      userId,
    });

    return response;
  };

  const sendChat = (message, chat) => {
    if (!socket) return;
    console.log('emit', socket, currentChatroom, currentShow, message);
    socket.emit(
      'sendChat',
      currentShow?._id,
      chat ||
        currentChatroom?._id ||
        currentShow?.generalChatroom?._id ||
        'general',
      session?.user?._id,
      message
    );
  };

  const deleteChat = async (chatMessageId) => {
    if (!socket) return;

    const response = await axios.delete(`${API_CHAT}/${chatMessageId}`);

    return response;
  };

  const createSongRequest = async ({ song, inDashboard }) => {
    if (!socket || !currentShow?._id) return;

    const response = await axios.post(`${API_SONG_REQUEST}/`, {
      showId: currentShow?._id,
      song,
    });

    return response;
  };

  const hideSongRequest = async ({ songRequestId, visible }) => {
    if (!socket) return;

    const response = await axios.post(
      `${API_SONG_REQUEST}/${songRequestId}/visible`,
      {
        visible,
      }
    );

    return response;
  };

  const deleteSongRequest = async ({ songRequestId }) => {
    if (!socket) return;

    const response = await axios.delete(`${API_SONG_REQUEST}/${songRequestId}`);

    return response;
  };

  const voteSongRequest = async ({ songRequestId, addVote }) => {
    if (!socket) return;

    const axiosMethod = addVote ? axios.post : axios.delete;

    const response = await axiosMethod(
      `${API_SONG_REQUEST}/${songRequestId}/vote`
    );

    return response;
  };

  const getPolls = async (filters) => {
    if (!socket) return;

    const response = await axios.post(API_POLLS, filters);

    if (response?.status === 200) {
      return response?.data?.data;
    }
    return response;
  };

  const createPoll = async (data) => {
    if (!socket || !currentShow?._id) return;

    const response = await axios.post(`${API_POLL}/`, {
      show: currentShow?._id,
      ...data,
    });

    if (response?.status === 200) {
      return response?.data?.data;
    }
    return response;
  };

  const updatePoll = async (data) => {
    if (!socket || !currentShow?._id) return;

    const response = await axios.post(`${API_POLL}/${data._id}/`, {
      show: currentShow?._id,
      ...data,
    });

    if (response?.status === 200) {
      return response?.data?.data;
    }
    return response;
  };

  const deletePoll = async (pollId) => {
    if (!socket) return;

    const response = await axios.delete(`${API_POLL}/${pollId}`);

    if (response?.status === 200) {
      return response?.data?.data;
    }
    return response;
  };

  const votePoll = async ({ pollId, optionIds }) => {
    if (!socket) return;

    const response = await axios.post(`${API_POLL}/${pollId}/vote`, {
      optionIds,
    });

    if (response?.status === 200) {
      return response?.data?.data;
    }
    return response;
  };

  const goToShow = (showId) => {
    router.push(`${SHOW}/${showId}`);
  };

  const kickUser = async ({ userId, showId }) => {
    if (!(showId || currentShow?._id) || !userId) return;
    console.log('kicking user: ', userId);

    try {
      const response = await axios.post(
        `${API_SHOW}/${showId || currentShow?._id}/kick`,
        {
          userId,
          socketId: socket?.id,
        }
      );
      if (response?.status === 200) {
        console.log(response?.data);
        // return response?.data?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const exports = {
    // Shows
    fetchedShows,
    setFetchedShows,

    // Show
    setCurrentShow,
    saveShow,
    deleteShow,
    joinShow,
    currentShow,
    goToShow,
    kickUser,
    uniqueParticipants,
    loadingShow,
    setLoadingShow,
    ownShows,
    setOwnShows,

    // Chatrooms
    availableChatrooms,

    // Chatroom
    uniqueParticipantsInChatroom,
    currentChatroom,
    setCurrentChatroom,
    createChatroom,
    deleteChatroom,
    updateChatroom,
    inviteToChatroom,
    joinChatroom,
    leaveChatroom,
    kickFromChatroom,
    showChatroomSettings,
    setShowChatroomSettings,
    ownChatroom,

    // Chat
    chatModalQueue,
    setChatModalQueue,
    sendChat,
    deleteChat,
    openChatMessage,
    setOpenChatMessage,
    loadingChat,
    setLoadingChat,

    // SongRequests
    currentSongRequests,
    createSongRequest,
    hideSongRequest,
    deleteSongRequest,
    voteSongRequest,

    // Polls
    loadingPolls,
    setLoadingPolls,
    presentedPoll,
    setPresentedPoll,
    currentPolls,
    setCurrentPolls,
    currentPoll,
    setCurrentPoll,
    getPolls,
    createPoll,
    updatePoll,
    deletePoll,
    votePoll,
  };

  return (
    <ShowContext.Provider value={exports}>{children}</ShowContext.Provider>
  );
};
