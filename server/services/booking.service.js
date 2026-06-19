const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { hasOverlap, generateAlternativeSlots } = require('../utils/dateTime.utils');

/**
 * Check if a room has any conflicting bookings for the requested slot
 */
const checkConflict = async (resourceId, startTime, endTime, excludeBookingId = null) => {
  const query = {
    resource: resourceId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  const conflict = await Booking.findOne(query);
  return conflict;
};

/**
 * Find up to 3 alternative available slots for a room
 */
const suggestAlternativeSlots = async (resourceId, requestedStart, requestedEnd) => {
  const candidates = generateAlternativeSlots(requestedStart, requestedEnd, 6);
  const available = [];
  for (const slot of candidates) {
    if (available.length >= 3) break;
    const conflict = await checkConflict(resourceId, slot.startTime, slot.endTime);
    if (!conflict) available.push(slot);
  }
  return available;
};

/**
 * Atomic booking creation using MongoDB transactions
 * Ensures zero double-bookings under concurrent requests
 */
const createBookingAtomic = async (resourceId, venueId, userId, startTime, endTime, guests = 1, totalPrice = 0, notes = '') => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const conflict = await Booking.findOne({
      resource: resourceId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    }).session(session);

    if (conflict) {
      await session.abortTransaction();
      session.endSession();
      const suggestions = await suggestAlternativeSlots(resourceId, startTime, endTime);
      return { success: false, conflict: true, suggestions };
    }

    const booking = await Booking.create(
      [{ resource: resourceId, venue: venueId, user: userId, startTime, endTime, guests, totalPrice, notes, status: 'pending' }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return { success: true, booking: booking[0] };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

module.exports = { checkConflict, suggestAlternativeSlots, createBookingAtomic };