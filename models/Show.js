import { Schema, model, models } from 'mongoose';

const ShowSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Every show must have an owner'],
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
      default: new Date() + (2 * 60 * 60 * 1000), // Now + 2 hours
    },
    maxWatchers: {
      type: Number,
    },
    allowSongRequests: {
      type: Boolean,
      default: true,
    },
    streamURL: {
      type: String,
      trim: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Show = models.Show || model('Show', ShowSchema);
