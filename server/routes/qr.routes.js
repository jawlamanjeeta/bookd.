const express = require('express');
const router = express.Router();
const { generateQR, checkIn } = require('../controllers/qr.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/:bookingId', protect, generateQR);
router.post('/checkin', protect, checkIn);

module.exports = router;