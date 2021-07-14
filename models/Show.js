import { Schema, model, models } from 'mongoose';

import { Chatroom } from './Chatroom';

const ShowSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Every show must have an owner'],
    },
    generalChatroom: {
      type: Schema.Types.ObjectId,
      ref: 'Chatroom',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [36, 'Title cannot be longer than 36 characters'],
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: Date,
      default: new Date() + 2 * 60 * 60 * 1000, // Now + 2 hours
    },
    maxSongRequestsPerUser: {
      type: Number,
      default: 1,
    },
    streamURL: {
      type: String,
      trim: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    connectedUsers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        socketId: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ShowSchema.pre('save', async function (next) {
  const generalChatroom = await Chatroom.create({
    name: 'General',
    owner: this.owner,
    show: this._id,
    isGeneral: true,
  });

  this.generalChatroom = generalChatroom;

  next();
});

export const Show = models.Show || model('Show', ShowSchema);
