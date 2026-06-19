const express = require('express');
const router = express.Router();
const {
  createBooking,
  confirmBooking,
  cancelBooking,
  getMyBookings,
  getResourceBookings,
  getBookingById,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/resource/:resourceId', protect, getResourceBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/confirm', protect, confirmBooking);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;