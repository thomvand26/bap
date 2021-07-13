import { Schema, model, models } from 'mongoose';

const SongRequestSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Every request must have an owner'],
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Every request must be linked to a show'],
    },
    song: {
      type: String,
      required: [true, 'Song is required'],
      trim: true,
    },
    upVoters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SongRequest =
  models.SongRequest || model('SongRequest', SongRequestSchema);
