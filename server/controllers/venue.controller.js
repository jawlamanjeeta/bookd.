const Venue = require('../models/Venue');

const getAllVenues = async (req, res, next) => {
  try {
    const { type, city, capacity } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (city) filter['location.city'] = new RegExp(city, 'i');

    const venues = await Venue.find(filter).populate('owner', 'name email');
    res.json(venues);
  } catch (err) {
    next(err);
  }
};

const getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email');
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    next(err);
  }
};

const createVenue = async (req, res, next) => {
  try {
    const venue = await Venue.create({ ...req.body, owner: req.user._id });
    res.status(201).json(venue);
  } catch (err) {
    next(err);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    next(err);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json({ message: 'Venue deactivated' });
  } catch (err) {
    next(err);
  }
};

const getMyVenues = async (req, res, next) => {
  try {
    const venues = await Venue.find({ owner: req.user._id, isActive: true });
    res.json(venues);
  } catch (err) {
    next(err);
  }
};

const updateVenueSettings = async (req, res, next) => {
  try {
    const { name, description, openingHours, rules, images } = req.body;
    const venue = await Venue.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name, description, openingHours, rules, images },
      { new: true, runValidators: true }
    );
    if (!venue) return res.status(404).json({ message: 'Venue not found or unauthorized' });
    res.json(venue);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getMyVenues,
  updateVenueSettings,
};