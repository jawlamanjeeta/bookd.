const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['table', 'court', 'room', 'desk'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerHour: {
      type: Number,
      default: 0,
    },
    amenities: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ venue: 1, type: 1 });

module.exports = mongoose.model('Resource', resourceSchema);