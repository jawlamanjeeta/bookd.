const Review = require('../models/Review');
const Venue = require('../models/Venue');
const Notification = require('../models/Notification');

const getVenueReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ venue: req.params.venueId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
};

const createReview = async (req, res, next) => {
  try {
    const { venueId, rating, comment, bookingId } = req.body;

    const existing = await Review.findOne({ user: req.user._id, venue: venueId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this venue' });

    const review = await Review.create({
      user: req.user._id, venue: venueId,
      rating, comment, booking: bookingId || null,
    });

    // Update venue rating
    const allReviews = await Review.find({ venue: venueId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Venue.findByIdAndUpdate(venueId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    // Notify venue owner
    const venue = await Venue.findById(venueId).populate('owner');
    if (venue?.owner) {
      await Notification.create({
        user: venue.owner._id,
        type: 'review_received',
        title: 'New Review',
        message: `${req.user.name} left a ${rating}★ review on ${venue.name}`,
        link: `/venues/${venueId}`,
      });
    }

    res.status(201).json(review);
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const allReviews = await Review.find({ venue: review.venue });
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await Venue.findByIdAndUpdate(review.venue, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getVenueReviews, createReview, deleteReview };