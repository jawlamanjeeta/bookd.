const express = require('express');
const router = express.Router();
const { joinWaitlist, getMyWaitlist, leaveWaitlist } = require('../controllers/waitlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, joinWaitlist);
router.get('/my', protect, getMyWaitlist);
router.delete('/:id', protect, leaveWaitlist);

module.exports = router;