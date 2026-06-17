const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled', 'released'],
      default: 'pending',
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index — prevents double bookings at DB level
bookingSchema.index(
  { room: 1, startTime: 1, endTime: 1 },
  { unique: false }
);

// Index for no-show cron job queries
bookingSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model('Booking', bookingSchema);