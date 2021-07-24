import { Schema, model, models } from 'mongoose';

const PollSchema = new Schema(
  {
    show: {
      type: Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Every poll must be linked to a show'],
    },
    pollTitle: {
      type: String,
      required: [true, 'Poll title is required'],
      trim: true,
    },
    options: {
      type: [
        {
          optionName: {
            type: String,
            required: [true, 'Option name is required'],
            trim: true,
          },
          voters: [
            {
              type: Schema.Types.ObjectId,
              ref: 'User',
            },
          ],
          position: Number,
        },
      ],
      validate: [
        optionsArrayLimit,
        'There must be at least 2 and at most 5 options',
      ],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    showResults: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

function optionsArrayLimit(optionsArray) {
  return optionsArray?.length > 1 && optionsArray?.length < 6;
}

export const Poll = models.Poll || model('Poll', PollSchema);
