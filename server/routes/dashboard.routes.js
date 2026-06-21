const express = require('express');
const router = express.Router();
const {
  getOwnerStats,
  getBookingsPerDay,
  getPeakHours,
  getOwnerReservations,
  updateReservationStatus,
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/stats', protect, getOwnerStats);
router.get('/bookings-per-day', protect, getBookingsPerDay);
router.get('/peak-hours', protect, getPeakHours);
router.get('/reservations', protect, getOwnerReservations);
router.patch('/reservations/:id/status', protect, updateReservationStatus);

module.exports = router;