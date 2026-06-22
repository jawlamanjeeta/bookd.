const express = require('express');
const router = express.Router();
const { getUserInsights } = require('../controllers/insights.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getUserInsights);

module.exports = router;