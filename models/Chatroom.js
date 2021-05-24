import { Schema, model, models } from 'mongoose';

const ChatroomSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Every chatroom must have an owner'],
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Every chatroom must be linked to a show'],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: [16, 'Name cannot be longer than 16 characters'],
    },
    isGeneral: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Chatroom = models.Chatroom || model('Chatroom', ChatroomSchema);
