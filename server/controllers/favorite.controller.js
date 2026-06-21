const Favorite = require('../models/Favorite');

const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('venue', 'name type location rating totalReviews openingHours')
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) { next(err); }
};

const addFavorite = async (req, res, next) => {
  try {
    const { venueId } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, venue: venueId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });
    const fav = await Favorite.create({ user: req.user._id, venue: venueId });
    res.status(201).json(fav);
  } catch (err) { next(err); }
};

const removeFavorite = async (req, res, next) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, venue: req.params.venueId });
    res.json({ success: true });
  } catch (err) { next(err); }
};

const checkFavorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOne({ user: req.user._id, venue: req.params.venueId });
    res.json({ isFavorite: !!fav });
  } catch (err) { next(err); }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };