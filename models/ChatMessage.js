import { Schema, model, models } from 'mongoose';

const ChatMessageSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Every chat message must have an owner'],
    },
    chatroom: {
      type: Schema.Types.ObjectId,
      ref: 'Chatroom',
      required: [true, 'Every chat message must have a room'],
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Every chat message must be linked to a show'],
    },
    message: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = models.ChatMessage || model('ChatMessage', ChatMessageSchema);
