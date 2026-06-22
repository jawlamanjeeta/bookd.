const Booking = require('../models/Booking');
const Venue = require('../models/Venue');

const getUserInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [allBookings, confirmed, cancelled] = await Promise.all([
      Booking.find({ user: userId }).populate('venue', 'name type location'),
      Booking.countDocuments({ user: userId, status: { $in: ['confirmed', 'completed'] } }),
      Booking.countDocuments({ user: userId, status: 'cancelled' }),
    ]);

    // Favorite venue
    const venueCounts = allBookings.reduce((acc, b) => {
      const id = b.venue?._id?.toString();
      if (id) acc[id] = { count: (acc[id]?.count || 0) + 1, venue: b.venue };
      return acc;
    }, {});
    const favoriteVenue = Object.values(venueCounts).sort((a, b) => b.count - a.count)[0];

    // Total hours booked
    const totalHours = allBookings.reduce((sum, b) => {
      return sum + Math.max(0, (new Date(b.endTime) - new Date(b.startTime)) / (1000 * 60 * 60));
    }, 0);

    // Total spend
    const totalSpend = allBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Bookings per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const perMonth = await Booking.aggregate([
      { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toISOString().slice(0, 7);
      const found = perMonth.find((m) => m._id === label);
      months.push({ month: label, count: found?.count || 0 });
    }

    // Preferred booking type
    const typeCounts = allBookings.reduce((acc, b) => {
      const t = b.venue?.type;
      if (t) acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    const preferredType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    res.json({
      totalBookings: allBookings.length,
      confirmedBookings: confirmed,
      cancelledBookings: cancelled,
      totalHours: Math.round(totalHours * 10) / 10,
      totalSpend,
      favoriteVenue: favoriteVenue?.venue || null,
      favoriteVenueCount: favoriteVenue?.count || 0,
      bookingsPerMonth: months,
      preferredType,
    });
  } catch (err) { next(err); }
};

module.exports = { getUserInsights };