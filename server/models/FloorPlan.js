const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  label: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, default: 80 },
  height: { type: Number, default: 60 },
  status: {
    type: String,
    enum: ['available', 'booked', 'occupied'],
    default: 'available',
  },
});

const floorPlanSchema = new mongoose.Schema(
  {
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true, unique: true },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 500 },
    spots: [spotSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FloorPlan', floorPlanSchema);