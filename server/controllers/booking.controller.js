const Booking = require('../models/Booking');
const { createBookingAtomic, checkConflict } = require('../services/booking.service');
const { emitAvailabilityUpdate } = require('../services/socket.service');

const createBooking = async (req, res, next) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user._id;

    const result = await createBookingAtomic(
      roomId,
      userId,
      new Date(startTime),
      new Date(endTime)
    );

    if (!result.success) {
      return res.status(409).json({
        message: 'Time slot is already booked',
        suggestions: result.suggestions,
      });
    }

    // Notify all clients watching this room
    emitAvailabilityUpdate(roomId, {
      type: 'new-booking',
      bookingId: result.booking._id,
    });

    res.status(201).json(result.booking);
  } catch (err) {
    next(err);
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    await booking.save();

    emitAvailabilityUpdate(booking.room.toString(), {
      type: 'booking-confirmed',
      bookingId: booking._id,
    });

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    emitAvailabilityUpdate(booking.room.toString(), {
      type: 'booking-cancelled',
      bookingId: booking._id,
    });

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name location capacity')
      .sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const getRoomBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      room: req.params.roomId,
      status: { $in: ['confirmed', 'pending'] },
    })
      .populate('user', 'name email')
      .sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  confirmBooking,
  cancelBooking,
  getMyBookings,
  getRoomBookings,
};


