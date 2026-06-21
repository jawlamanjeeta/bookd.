const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const Venue = require('../models/Venue');

const getOwnerStats = async (req, res, next) => {
  try {
    const venues = await Venue.find({ owner: req.user._id, isActive: true });
    const venueIds = venues.map((v) => v._id);
    const resourceDocs = await Resource.find({ venue: { $in: venueIds }, isActive: true });
    const resourceIds = resourceDocs.map((r) => r._id);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todaysBookings, totalConfirmed, revenueAgg] = await Promise.all([
      Booking.countDocuments({
        resource: { $in: resourceIds },
        startTime: { $gte: todayStart, $lte: todayEnd },
        status: { $in: ['confirmed', 'pending'] },
      }),
      Booking.countDocuments({
        resource: { $in: resourceIds },
        status: 'confirmed',
      }),
      Booking.aggregate([
        { $match: { resource: { $in: resourceIds }, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalSlots = resourceDocs.length * 12;
    const occupancyRate = totalSlots > 0
      ? Math.min(100, Math.round((totalConfirmed / totalSlots) * 100))
      : 0;

    res.json({
      todaysBookings,
      activeResources: resourceDocs.length,
      occupancyRate,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

const getBookingsPerDay = async (req, res, next) => {
  try {
    const venues = await Venue.find({ owner: req.user._id });
    const venueIds = venues.map((v) => v._id);
    const resources = await Resource.find({ venue: { $in: venueIds } });
    const resourceIds = resources.map((r) => r._id);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const data = await Booking.aggregate([
      {
        $match: {
          resource: { $in: resourceIds },
          createdAt: { $gte: sevenDaysAgo },
          status: { $in: ['confirmed', 'pending'] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toISOString().split('T')[0];
      const found = data.find((x) => x._id === label);
      days.push({ date: label, count: found?.count || 0 });
    }

    res.json(days);
  } catch (err) {
    next(err);
  }
};

const getPeakHours = async (req, res, next) => {
  try {
    const venues = await Venue.find({ owner: req.user._id });
    const venueIds = venues.map((v) => v._id);
    const resources = await Resource.find({ venue: { $in: venueIds } });
    const resourceIds = resources.map((r) => r._id);

    const data = await Booking.aggregate([
      {
        $match: {
          resource: { $in: resourceIds },
          status: { $in: ['confirmed', 'pending'] },
        },
      },
      {
        $group: {
          _id: { $hour: '$startTime' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const hours = Array.from({ length: 24 }, (_, i) => {
      const found = data.find((x) => x._id === i);
      return { hour: `${i}:00`, count: found?.count || 0 };
    });

    res.json(hours);
  } catch (err) {
    next(err);
  }
};

const getOwnerReservations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const venues = await Venue.find({ owner: req.user._id });
    const venueIds = venues.map((v) => v._id);
    const resources = await Resource.find({ venue: { $in: venueIds } });
    const resourceIds = resources.map((r) => r._id);

    const filter = { resource: { $in: resourceIds } };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('resource', 'name type')
      .populate('venue', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['confirmed', 'cancelled', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'confirmed' ? { confirmedAt: new Date() } : {}) },
      { new: true }
    ).populate('user', 'name email').populate('resource', 'name');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOwnerStats,
  getBookingsPerDay,
  getPeakHours,
  getOwnerReservations,
  updateReservationStatus,
};