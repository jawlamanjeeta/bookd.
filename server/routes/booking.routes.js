const express = require('express');
const router = express.Router();
const {
  createBooking,
  confirmBooking,
  cancelBooking,
  getMyBookings,
  getRoomBookings,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/room/:roomId', protect, getRoomBookings);
router.patch('/:id/confirm', protect, confirmBooking);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;