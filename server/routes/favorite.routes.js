const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, checkFavorite } = require('../controllers/favorite.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.get('/check/:venueId', protect, checkFavorite);
router.delete('/:venueId', protect, removeFavorite);

module.exports = router;