const express = require('express');
const router = express.Router();
const {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getMyVenues,
  updateVenueSettings,
} = require('../controllers/venue.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getAllVenues);
router.get('/my', protect, getMyVenues);
router.get('/:id', getVenueById);
router.post('/', protect, createVenue);
router.put('/:id', protect, adminOnly, updateVenue);
router.patch('/:id/settings', protect, updateVenueSettings);
router.delete('/:id', protect, adminOnly, deleteVenue);

module.exports = router;