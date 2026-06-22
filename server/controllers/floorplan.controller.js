const FloorPlan = require('../models/FloorPlan');
const Booking = require('../models/Booking');
const { getIO } = require('../config/socket');

const getFloorPlan = async (req, res, next) => {
  try {
    let plan = await FloorPlan.findOne({ venue: req.params.venueId })
      .populate('spots.resource', 'name type capacity');

    if (!plan) return res.status(404).json({ message: 'Floor plan not found' });

    // Dynamically compute status from active bookings
    const now = new Date();
    const resourceIds = plan.spots.map((s) => s.resource?._id);

    const activeBookings = await Booking.find({
      resource: { $in: resourceIds },
      status: { $in: ['confirmed', 'pending'] },
      startTime: { $lte: new Date(now.getTime() + 60 * 60 * 1000) },
      endTime: { $gte: now },
    });

    const bookedIds = new Set(activeBookings.map((b) => b.resource.toString()));

    const spotsWithStatus = plan.spots.map((s) => ({
      ...s.toObject(),
      status: bookedIds.has(s.resource?._id?.toString()) ? 'booked' : 'available',
    }));

    res.json({ ...plan.toObject(), spots: spotsWithStatus });
  } catch (err) { next(err); }
};

const createOrUpdateFloorPlan = async (req, res, next) => {
  try {
    const { width, height, spots } = req.body;
    const plan = await FloorPlan.findOneAndUpdate(
      { venue: req.params.venueId },
      { venue: req.params.venueId, width, height, spots },
      { new: true, upsert: true, runValidators: true }
    );

    // Broadcast update to all clients viewing this floor plan
    try {
      const io = getIO();
      io.to(`floorplan-${req.params.venueId}`).emit('floorplan-updated', { venueId: req.params.venueId });
    } catch (_) {}

    res.json(plan);
  } catch (err) { next(err); }
};

const generateFloorPlan = async (req, res, next) => {
  try {
    const Resource = require('../models/Resource');
    const resources = await Resource.find({ venue: req.params.venueId, isActive: true });

    if (resources.length === 0) {
      return res.status(400).json({ message: 'No resources found for this venue' });
    }

    const cols = Math.ceil(Math.sqrt(resources.length));
    const spots = resources.map((r, i) => ({
      resource: r._id,
      label: r.name,
      x: (i % cols) * 160 + 40,
      y: Math.floor(i / cols) * 120 + 40,
      width: 120,
      height: 80,
      status: 'available',
    }));

    const plan = await FloorPlan.findOneAndUpdate(
      { venue: req.params.venueId },
      { venue: req.params.venueId, width: cols * 160 + 80, height: Math.ceil(resources.length / cols) * 120 + 80, spots },
      { new: true, upsert: true }
    );

    res.json(plan);
  } catch (err) { next(err); }
};

module.exports = { getFloorPlan, createOrUpdateFloorPlan, generateFloorPlan };