const express = require('express');
const router = express.Router();
const {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
} = require('../controllers/venue.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getAllVenues);
router.get('/:id', getVenueById);
router.post('/', protect, createVenue);
router.put('/:id', protect, adminOnly, updateVenue);
router.delete('/:id', protect, adminOnly, deleteVenue);

module.exports = router;