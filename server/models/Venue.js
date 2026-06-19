const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['restaurant', 'meeting_room', 'sports_court', 'study_room'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
    },
    images: [String],
    rules: [String],
    openingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '21:00' },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

venueSchema.index({ type: 1, 'location.city': 1 });

module.exports = mongoose.model('Venue', venueSchema);