const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const Venue = require('../models/Venue');

const getAnalytics = async (req, res, next) => {
  try {
    const venues = await Venue.find({ owner: req.user._id });
    const venueIds = venues.map((v) => v._id);
    const resources = await Resource.find({ venue: { $in: venueIds } });
    const resourceIds = resources.map((r) => r._id);

    const [total, confirmed, cancelled, revenueAgg, popularResources, peakTimes] = await Promise.all([
      Booking.countDocuments({ resource: { $in: resourceIds } }),
      Booking.countDocuments({ resource: { $in: resourceIds }, status: 'confirmed' }),
      Booking.countDocuments({ resource: { $in: resourceIds }, status: 'cancelled' }),
      Booking.aggregate([
        { $match: { resource: { $in: resourceIds }, status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Booking.aggregate([
        { $match: { resource: { $in: resourceIds }, status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: '$resource', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'resources', localField: '_id', foreignField: '_id', as: 'resource' } },
        { $unwind: '$resource' },
        { $project: { name: '$resource.name', type: '$resource.type', count: 1, revenue: 1 } },
      ]),
      Booking.aggregate([
        { $match: { resource: { $in: resourceIds }, status: { $in: ['confirmed', 'pending'] } } },
        { $group: { _id: { $hour: '$startTime' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const occupancyRate = resources.length > 0
      ? Math.min(100, Math.round((confirmed / (resources.length * 12)) * 100))
      : 0;

    const cancellationRate = total > 0
      ? Math.round((cancelled / total) * 100)
      : 0;

    res.json({
      totalBookings: total,
      confirmedBookings: confirmed,
      cancelledBookings: cancelled,
      occupancyRate,
      cancellationRate,
      totalRevenue: revenueAgg[0]?.total || 0,
      popularResources,
      peakTimes: peakTimes.map((p) => ({ hour: `${p._id}:00`, count: p.count })),
    });
  } catch (err) { next(err); }
};

const getCalendarBookings = async (req, res, next) => {
  try {
    const { start, end, resourceId } = req.query;
    const filter = {
      status: { $in: ['confirmed', 'pending'] },
      startTime: { $gte: new Date(start) },
      endTime: { $lte: new Date(end) },
    };
    if (resourceId) filter.resource = resourceId;

    const bookings = await Booking.find(filter)
      .populate('resource', 'name type')
      .populate('venue', 'name')
      .populate('user', 'name')
      .sort({ startTime: 1 });

    res.json(bookings);
  } catch (err) { next(err); }
};

module.exports = { getAnalytics, getCalendarBookings };