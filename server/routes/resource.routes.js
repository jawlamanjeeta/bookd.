const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getResourcesByVenue,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resource.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getResourcesByVenue);
router.post('/', protect, createResource);
router.get('/:id', getResourceById);
router.put('/:id', protect, adminOnly, updateResource);
router.delete('/:id', protect, adminOnly, deleteResource);

module.exports = router;