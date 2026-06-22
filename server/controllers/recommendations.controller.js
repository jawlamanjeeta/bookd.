const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Resource = require('../models/Resource');

const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get user's booking history
    const userBookings = await Booking.find({ user: userId })
      .populate('venue', 'type')
      .populate('resource', 'type');

    const bookedVenueIds = [...new Set(userBookings.map((b) => b.venue?._id?.toString()).filter(Boolean))];
    const preferredTypes = userBookings.map((b) => b.venue?.type).filter(Boolean);
    const typeCounts = preferredTypes.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    // 2. Similar venues — same type, not already booked
    const similarVenues = await Venue.find({
      type: topType || 'meeting_room',
      isActive: true,
      _id: { $nin: bookedVenueIds },
    }).limit(4);

    // 3. Popular venues overall
    const popularAgg = await Booking.aggregate([
      { $group: { _id: '$venue', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
    ]);
    const popularIds = popularAgg.map((p) => p._id);
    const popularVenues = await Venue.find({ _id: { $in: popularIds }, isActive: true });

    // 4. Popular time slots
    const peakSlots = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: { $hour: '$startTime' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    // 5. Frequently booked resources
    const freqResources = await Booking.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$resource', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);
    const freqIds = freqResources.map((r) => r._id);
    const frequentResources = await Resource.find({ _id: { $in: freqIds } })
      .populate('venue', 'name type');

    res.json({
      similarVenues,
      popularVenues,
      peakSlots: peakSlots.map((s) => ({ hour: `${s._id}:00`, count: s.count })),
      frequentResources,
      preferredType: topType,
    });
  } catch (err) { next(err); }
};

module.exports = { getRecommendations };