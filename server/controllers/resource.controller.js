const Resource = require('../models/Resource');

const getResourcesByVenue = async (req, res, next) => {
  try {
    const { capacity } = req.query;
    const filter = { venue: req.params.venueId, isActive: true };
    if (capacity) filter.capacity = { $gte: Number(capacity) };

    const resources = await Resource.find(filter);
    res.json(resources);
  } catch (err) {
    next(err);
  }
};

const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('venue');
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      venue: req.params.venueId,
    });
    res.status(201).json(resource);
  } catch (err) {
    next(err);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    next(err);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deactivated' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getResourcesByVenue,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};