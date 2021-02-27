import { useRouter } from 'next/router';
import React from 'react';
import { useSession } from '../../context';
import { ROOM } from '../../routes';

export const RoomList = (showCreateRoomBtn) => {
  const { rooms, createRoom, joinRoom } = useSession();
  const router = useRouter();

  const goToRoom = (roomId) => {
    // console.log(roomId);
    router.push(`${ROOM}/${roomId}`);
  };

  const handleCreateClick = () => {
    createRoom((roomId) => goToRoom(roomId));
  };

  const handleJoinClick = (roomId) => {
    goToRoom(roomId);
  };

  return (
    <div>
      {showCreateRoomBtn && (
        <button onClick={handleCreateClick}>Create room</button>
      )}
      <div>
        {rooms.map?.((room, i) => {
          return (
            <div key={room.roomId} onClick={() => handleJoinClick(room.roomId)}>
              {room.roomId} ({room?.clientIds?.length})
            </div>
          );
        })}
      </div>
    </div>
  );
};
