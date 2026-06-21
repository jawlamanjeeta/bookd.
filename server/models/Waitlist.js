const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['waiting', 'notified', 'booked', 'expired'],
      default: 'waiting',
    },
    notifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

waitlistSchema.index({ resource: 1, startTime: 1, status: 1 });
waitlistSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);