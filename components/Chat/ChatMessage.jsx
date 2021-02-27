import React from 'react';

export const ChatMessage = ({ userName, message }) => {
  return (
    <div>
      <strong>{userName}:</strong> {message}
    </div>
  );
};
