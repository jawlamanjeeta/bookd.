const express = require('express');
const router = express.Router();
const { getAnalytics, getCalendarBookings } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAnalytics);
router.get('/calendar', protect, getCalendarBookings);

module.exports = router;
